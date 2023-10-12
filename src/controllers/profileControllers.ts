import { Request, Response } from 'express';
import {users} from "../models/users";

export const postProfileMedias = async (req: Request, res: Response) => {
    //TODO: Implement this
}

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