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
        const userProfileMedias = await profileMedias.findAll({ where: { user_id: req.user.userId } }).catch(e => {
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
        userToUpdate.user_name = userName;
        userToUpdate.date_of_birth = dateOfBirth;
        userToUpdate.gender_id = genderId;
        userToUpdate.profile_description = profileDescription;
        userToUpdate.height = height;
        userToUpdate.body_type_id = bodyType;

        // Save the updated user details
        await userToUpdate.save();

        const isProfileComplete = await checkProfileCompletionHelper(req.user.userId);
        return sendResponse(res, 200, true, "Profile details updated successfully", {isProfileComplete}, null)
    } catch (error:any) {
        return sendResponse(res, 500, false, "An error occurred while updating profile details", null, error.message)
    }
}

export const postProfileLocation = async (req: any, res: Response) => {
    logHelper({level: "INFO", message: "posting/updating profile location", functionName: "postProfileLocation",additionalData: JSON.stringify(req.user)});
    try {
        const userId = req.user.userId; // Get userId from JWT middleware
        const { longitude, latitude, country, state, city } = req.body;

        // Use upsert to either update or create based on the userId
        await locations.upsert({
            user_id: userId, // Use this to determine if a record exists
            longitude: longitude,
            latitude: latitude,
            country: country,
            state: state,
            city: city
        });

        const isProfileComplete = await checkProfileCompletionHelper(req.user.userId);

        return sendResponse(res, 200, true, "Location updated/added successfully.", {isProfileComplete}, null)
    } catch (error:any) {
        console.error("Error handling location: ", error);
        return sendResponse(res, 500, false, "Failed to handle location", null, error.message)
    }
}

export const putPreferences = async (req: any, res: Response) => {
    const userId = req.user.userId;

    const { min_age, max_age, min_distance, max_distance, min_height, max_height, body_type_preference_id, gender_preference_id } = req.body;

    try {
        // Find the user's preference record
        const preference = await preferences.findOne({ where: { user_id: userId } });

        // If no preference record is found for the user, handle it (maybe create one with default values or send an error response)
        if (!preference) {
            return sendResponse(res, 404, false,"No preference record found for the user.");
        }

        // Update the preference
        preference.min_age = min_age;
        preference.max_age = max_age;
        preference.min_distance = min_distance;
        preference.max_distance = max_distance;
        preference.min_height = min_height;
        preference.max_height = max_height;
        preference.body_type_preference_id = body_type_preference_id;
        preference.gender_preference_id = gender_preference_id;

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
        const fetchingUsers = await users.findAll({ where: query });

        return sendResponse(res, 200, true, "Profiles fetched successfully.", {user: fetchingUsers});
    } catch (error: any) {
        return sendResponse(res, 500, false, "Error fetching profiles.", null,error.message);
    }
}
