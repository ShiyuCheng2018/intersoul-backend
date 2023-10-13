import {Response } from 'express';
import {users} from "../models/users";
import {profileMedias} from "../models/profile_medias";
import {getMaxMediaOrderForUser} from "../helper/profileHelper";

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

        // Assuming you're using Sequelize:
        await profileMedias.create(mediaToSave);

        res.status(200).send({ message: 'Medias uploaded successfully.', medias: mediaToSave });
    } catch (error) {
        next(error);
    }
};

export const putProfileDetails = async (req: any, res: Response) => {

    if(req.user === undefined){
        return res.status(401).json({ message: "authorization denied" });
    }

    // Retrieve the userId from JWT payload
    const userId = req.user?.userId;

    // Retrieve the new details from the request body
    const { userName, dateOfBirth, genderId, profileDescription } = req.body;

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

        // Save the updated user details
        await userToUpdate.save();

        return res.status(200).json({ message: "Profile details updated successfully" });
    } catch (error) {
        console.error("Error updating profile details:", error);
        return res.status(500).json({ message: "An error occurred while updating profile details" });
    }
}