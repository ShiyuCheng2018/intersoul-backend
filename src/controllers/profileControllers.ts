import { Request, Response } from 'express';

export const postProfileMedias = async (req: Request, res: Response) => {
    //TODO: Implement this
}

export const putProfileDetails = async (req: Request, res: Response) => {
    const {userName, dateOfBirth, genderId, profileDescription} = req.body;
// Input validation (you can add more detailed checks)
    if (!userName || !dateOfBirth || !genderId || !profileDescription){
        return res.status(400).json({ message: "Required fields are missing" });
    }

    // // Input validation
    // if (!userName || !dateOfBirth || !genderId || !profileDiscription){
    //     return res.status(400).json({ message: "Required fields are missing" });
    // }
}