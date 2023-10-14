import {Response } from 'express';
import {users} from "../models/users";
import {profileMedias} from "../models/profile_medias";
import {getMaxMediaOrderForUser} from "../helper/profileHelper";
import {Sequelize, Op} from "sequelize";
import {checkProfileCompletionHelper} from "../helper/checkProfileCompletionHelper";
import {locations} from "../models/locations";
import {interactions, interactionsAttributes, preferences} from "../models/init-models";

export const postProfileMedia = async (req: any, res: Response, next: any) => {
    console.log(req.body)
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No files uploaded.' });
        }

        const startingOrder = await getMaxMediaOrderForUser(req.user.userId);

        if(startingOrder === 6){
            return res.status(400).send({ message: 'Your reached the maximum profile media uploading.' });
        }

        const mediaToSave = {
            user_id: req.user.userId,
            profile_media_type_id: req.body.mediaType,
            media_path: req.file.location, // The URL that S3 returns
            upload_date: new Date(),
            order: startingOrder + 1 // Only increment by 1 since it's one file
        };

        await profileMedias.create(mediaToSave);
        const isProfileComplete = await checkProfileCompletionHelper(req.user.userId);

        res.status(200).send({ message: 'Medias uploaded successfully.', medias: mediaToSave, isProfileComplete });
    } catch (error) {
        next(error);
    }
};

export const deleteProfileMedia = async (req: any, res: Response, next: any) => {
    const mediaId = req.params.mediaId;

    try {
        const media = await profileMedias.findOne({ where: { profile_media_id: mediaId } });
        if (!media) {
            return res.status(404).send({ message: 'Media not found.' });
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

        res.status(200).send({ message: 'Media deleted successfully.', isProfileComplete});
    } catch (error) {
        next(error);
    }
}

export const putProfileDetails = async (req: any, res: Response) => {

    if(req.user === undefined){
        return res.status(401).json({ message: "authorization denied" });
    }

    // Retrieve the userId from JWT payload
    const userId = req.user?.userId;

    // Retrieve the new details from the request body
    const { userName, dateOfBirth, genderId, profileDescription, height, bodyType } = req.body;

    // Input validation
    if (!userName || !dateOfBirth || !genderId || !profileDescription) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    try {
        // Find the user by userId
        const userToUpdate = await users.findByPk(userId);

        // If user doesn't exist
        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found" });
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
        return res.status(200).json({ message: "Profile details updated successfully", isProfileComplete});
    } catch (error) {
        console.error("Error updating profile details:", error);
        return res.status(500).json({ message: "An error occurred while updating profile details" });
    }
}

export const postProfileLocation = async (req: any, res: Response) => {
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

        res.status(200).json({ message: "Location updated/added successfully.", isProfileComplete });
    } catch (error) {
        console.error("Error handling location: ", error);
        res.status(500).json({ error: "Failed to handle location" });
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
            return res.status(404).json({ success: false, message: "No preference record found for the user." });
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

        return res.status(200).json({ success: true, message: "Preferences updated successfully." });
    } catch (error:any) {
        return res.status(500).json({ success: false, message: "Error updating preferences.", error: error.message });
    }
}

export const fetchProfiles = async (req: any, res: Response) => {
    const userId = req.user.userId;

    try {
        const user = await users.findOne({ where: { user_id: userId } });
        if(!user){
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user && !user.is_profile_complete) {
            return res.status(200).json({ success: true, message: "Complete your profile to see others and to be seen.", profiles: [] });
        }

        // Get user preferences
        const userPreference = await preferences.findOne({ where: { user_id: userId } });

        if (!userPreference) {
            return res.status(404).json({ success: false, message: "No preference record found for the user." });
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

        return res.status(200).json({ success: true, fetchingUsers });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Error fetching profiles.", error: error.message });
    }
}
