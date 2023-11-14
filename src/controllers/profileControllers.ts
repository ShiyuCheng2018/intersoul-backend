import {Response } from 'express';
import {users} from "../models/users";
import {profileMedias} from "../models/profile_medias";
import {getMaxMediaOrderForUser} from "../helper/profileHelper";
import {Sequelize, Op} from "sequelize";
import {checkProfileCompletionHelper} from "../helper/checkProfileCompletionHelper";
import {locations} from "../models/locations";
import {interactions, interactionsAttributes, preferences} from "../models/init-models";
import {sendResponse} from "../helper/sendResponse";
import {logHelper} from "../helper/functionLoggerHelper";
import axios from "axios";

export const postProfileMedia = async (req: any, res: Response, next: any) => {
    logHelper({ level: "INFO", message: "Uploading profile media", functionName: "postProfileMedia", additionalData: JSON.stringify(req.user) });
    try {
        if (!req.file) {
            return sendResponse(res, 400, false, "No files uploaded.", null, null);
        }

        const startingOrder = await getMaxMediaOrderForUser(req.user.userId);

        if(startingOrder === 6){
            return sendResponse(res, 400, false, "You reached the maximum profile media uploading.", null, null);
        }

        const mediaToSave:{user_id: string, profile_media_type_id: string, media_path: string,upload_date:Date,order:number} = {
            user_id: req.user.userId,
            profile_media_type_id: req.body.mediaType,
            media_path: req.file.location, // The URL that S3 returns
            upload_date: new Date(),
            order: startingOrder + 1 // Only increment by 1 since it's one file
        };

        await profileMedias.create(mediaToSave).catch(e => {
            console.error("Error during profileMedias.create: ", e);
        });
        const userProfileMedias = await profileMedias.findAll({ where: { user_id: req.user.userId },  attributes: { exclude: ['createdAt', 'updatedAt'] }}).catch(e => {
            console.error("Error during await profileMedias.findAll", e);
        });
        const isProfileComplete = await checkProfileCompletionHelper(req.user.userId).catch(e => {
            console.error("Error during await checkProfileCompletionHelper", e);
        });
        return sendResponse(res, 200, true, "Media uploaded successfully", {userProfileMedias, isProfileComplete}, null)
    } catch (error) {
        next(error);
    }
};

export const deleteProfileMedia = async (req: any, res: Response, next: any) => {
    logHelper({ level: "INFO", message: "Deleting profile media", functionName: "deleteProfileMedia", additionalData: JSON.stringify(req.user)});
    const mediaId = req.params.mediaId;

    try {
        const media = await profileMedias.findOne({ where: { profile_media_id: mediaId } });
        if (!media) {
            return sendResponse(res, 404, false, "Media not found", null, null);
        }

        // Use AWS SDK to delete `media.media_path` from your S3 bucket
        //TODO: Delete from S3

        const mediaOrder = media.order;

        // Delete the media from the database
        await profileMedias.destroy({ where: { profile_media_id: mediaId } });

        // Reorder the remaining medias
        await profileMedias.update(
            { order: Sequelize.literal('"order" - 1') },
            { where: { "order": { [Op.gt]: mediaOrder } } }
        );

        const isProfileComplete = await checkProfileCompletionHelper(req.user.userId);

        return sendResponse(res, 200, true, "Media deleted successfully", null, isProfileComplete)
    } catch (error) {
        next(error);
    }
}

export const putProfileDetails = async (req: any, res: Response) => {
    logHelper({level: "INFO", message: "Updating profile details", functionName: "putProfileDetails", additionalData: JSON.stringify(req.user) });
    if(req.user === undefined){
        return sendResponse(res, 401, false, "authorization denied", null, null)
    }

    // Retrieve the userId from JWT payload
    const userId = req.user?.userId;

    // Retrieve the new details from the request body
    const { userName, dateOfBirth, genderId, profileDescription, height, bodyType } = req.body;

    // Input validation
    if (!userName || !dateOfBirth || !genderId || !profileDescription) {
        return sendResponse(res, 400, false, "Required fields are missing", null, null);
    }

    try {
        // Find the user by userId
        const userToUpdate = await users.findByPk(userId);

        // If user doesn't exist
        if (!userToUpdate) {
            return sendResponse(res, 404, false, "User not found", null, null);
        }

        // Update the user details
        if(!userToUpdate.user_name) userToUpdate.user_name = userName;
        if(!userToUpdate.date_of_birth) userToUpdate.date_of_birth = dateOfBirth;
        if(!userToUpdate.gender_id) userToUpdate.gender_id = genderId;
        if(userToUpdate.profile_description !== profileDescription) userToUpdate.profile_description = profileDescription;
        if(height && userToUpdate.height !== height) userToUpdate.height = height;
        if(bodyType && userToUpdate.body_type_id !== bodyType) userToUpdate.body_type_id = bodyType;

        // Save the updated user details
        await userToUpdate.save();

        const isProfileComplete = await checkProfileCompletionHelper(req.user.userId);
        return sendResponse(res, 200, true, "Profile details updated successfully", {isProfileComplete}, null)
    } catch (error:any) {
        return sendResponse(res, 500, false, "An error occurred while updating profile details", null, error.message)
    }
}


export const postProfileLocation = async (req: any, res: Response) => {
    logHelper({ level: "INFO", message: "posting/updating profile location", functionName: "postProfileLocation", additionalData: JSON.stringify(req.user) });

    try {
        const userId = req.user.userId; // Get userId from JWT middleware
        const { longitude, latitude } = req.body;

        // Call Google Geocoding API
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`);

        // Extract address components
        const addressComponents = response.data.results[0].address_components;
        let country = "", state = "", city = "";

        addressComponents.forEach((component:any) => {
            if (component.types.includes("country")) {
                country = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
            }
            if (component.types.includes("locality")) {
                city = component.long_name;
            }
        });

        // Use upsert to either update or create based on the userId
         await locations.upsert({
            user_id: userId,
            longitude: longitude,
            latitude: latitude,
            country: country,
            state: state,
            city: city
        });

        // Fetch the latest location record for the user
        const location = await locations.findOne({
            where: { user_id: userId },
            order: [['updated_at', 'DESC']], // Order by the most recent update
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        const isProfileComplete = await checkProfileCompletionHelper(userId);

        return sendResponse(res, 200, true, "Location updated/added successfully.", { isProfileComplete, location }, null)
    } catch (error:any) {
        console.error("Error handling location: ", error);
        return sendResponse(res, 500, false, "Failed to handle location", null, error.message)
    }
};


export const getPreferences = async (req: any, res: Response) => {
    logHelper({level: "INFO", message: "Fetching preferences", functionName:"getPreferences", additionalData: JSON.stringify(req.user)});

    const userId = req.user.userId;
    try{
        const preference = await preferences.findOne({ where: { user_id: userId }, attributes: { exclude: ['createdAt', 'updatedAt'] }});

        // If no preference record is found for the user, send an error response
        if (!preference) {
            return sendResponse(res, 404, false,"No preference record found for the user.");
        }

        return sendResponse(res, 200, true, "Preferences fetched successfully.", preference, null);
    }catch (error:any) {
        return sendResponse(res, 500, false, "Error fetching preferences.",null, error.message);
    }
}

export const putPreferences = async (req: any, res: Response) => {
    logHelper({level: "INFO", message: "Putting preferences", functionName:"putPreferences", additionalData: JSON.stringify(req.user)});
    const userId = req.user.userId;

    const { minAge, maxAge, minDistance, maxDistance, minHeight, maxHeight, bodyTypePreferenceId, genderPreferenceId } = req.body;

    try {
        // Find the user's preference record
        const preference = await preferences.findOne({ where: { user_id: userId },  attributes: { exclude: ['createdAt', 'updatedAt'] }});

        // If no preference record is found for the user, handle it (maybe create one with default values or send an error response)
        if (!preference) {
            return sendResponse(res, 404, false,"No preference record found for the user.");
        }

        // Update the preference
        if(minAge && preference.min_age!==minAge) preference.min_age = minAge;
        if(maxAge && preference.max_age!==maxAge) preference.max_age = maxAge;
        if(minDistance && preference.min_distance!==minDistance) preference.min_distance = minDistance;
        if(maxDistance && preference.max_distance!==maxDistance) preference.max_distance = maxDistance;
        if(minHeight && preference.min_height!==minHeight) preference.min_height = minHeight;
        if(maxHeight && preference.max_height!==maxHeight) preference.max_height = maxHeight;
        if(bodyTypePreferenceId && preference.body_type_preference_id!==bodyTypePreferenceId) preference.body_type_preference_id = bodyTypePreferenceId;
        if (genderPreferenceId && preference.gender_preference_id !== genderPreferenceId) preference.gender_preference_id = genderPreferenceId;

        await preference.save();

        return sendResponse(res, 200, true, "Preferences updated successfully.");
    } catch (error:any) {
        return sendResponse(res, 500, false, "Error updating preferences.",null, error.message);
    }
}

export const fetchProfiles = async (req: any, res: Response) => {
    logHelper({level: "INFO", message: "Fetching profiles", functionName:"fetchProfiles", additionalData: JSON.stringify(req.user)});
    const userId = req.user.userId;

    try {
        const user = await users.findOne({ where: { user_id: userId } });

        if(!user){
            return sendResponse(res, 404, false, "User not found.", [], "User not found.");
        }

        if (user && !user.is_profile_complete) {
            return sendResponse(res, 200, true, "Complete your profile to see others and to be seen.", []);
        }

        // Get user preferences
        const userPreference = await preferences.findOne({ where: { user_id: userId } });

        if (!userPreference) {
            return sendResponse(res, 404, false, "No preference record found for the user.", []);
        }

        // Construct query based on user preference
        let query: any = {};

        query.is_profile_complete = true;

        if (userPreference.gender_preference_id) {
            query.gender_id = userPreference.gender_preference_id;
        }

        if (userPreference.body_type_preference_id) {
            query.body_type_id = userPreference.body_type_preference_id;
        }

        if (userPreference.min_age && userPreference.max_age) {
            Sequelize.literal(`EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN ${userPreference.min_age} AND ${userPreference.max_age}`);
        }

        if (userPreference.min_height && userPreference.max_height) {
            query.height = { [Op.between]: [userPreference.min_height, userPreference.max_height] };
        }

        // Get list of users that the current user has interacted with
        const interactionsInitiatedByCurrentUser = await interactions.findAll({
            where: {
                user1_id: userId
            }
        });

        // Get list of users who unmatched with the current user
        const unmatchedByOthers = await interactions.findAll({
            where: {
                user2_id: userId,
                interaction_type_id: 'b8a97ca4-0ceb-4edc-ac8f-4570a1ff1a4a' // Replace 'UNMATCHED' with its actual value if different
            }
        });

        const interactedUserIds = interactionsInitiatedByCurrentUser.map((interaction:interactionsAttributes) => interaction.user2_id);
        const unmatchedUserIds = unmatchedByOthers.map((interaction:interactionsAttributes)  => interaction.user1_id);

        // Exclude interacted users and users who unmatched with the current user
        query.user_id = {
            [Op.notIn]: [...interactedUserIds, ...unmatchedUserIds, userId]
        };

        // Fetch users matching the criteria
        const fetchingUsers = await users.findAll({ where: query,
            attributes: { exclude: ['createdAt', 'updatedAt', "hashed_password", "provider", "provider_id"]},
            include: [{
                model: profileMedias,
                as: 'profile_media',
                attributes: ['media_path', 'profile_media_type_id', 'order'] // Include only required attributes
            }]
        });


        for (const user of fetchingUsers) {
            try {
                const latestLocation = await locations.findOne({
                    where: {user_id: user.user_id},
                    order: [['updated_at', 'DESC']],
                    attributes: ['city', 'state', 'country', 'latitude', 'longitude']
                });
                (user as any).location = latestLocation;
            }catch (error:any) {
                console.error("Error fetching location:", error);
                return sendResponse(res, 500, false, "Error fetching location.", null, error.message);
            }
        }

        return sendResponse(res, 200, true, "Profiles fetched successfully.", fetchingUsers);
    } catch (error: any) {
        return sendResponse(res, 500, false, "Error fetching profiles.", null,error.message);
    }
}
