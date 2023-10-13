import {users} from '../models/users';
import {locations} from "../models/locations";
import {profileMedias} from "../models/profile_medias";

export const checkProfileCompletion = async (req: any, res: any, next: any) => {
    const user_id = req.user.userId; // Use optional chaining here

    if (!user_id || req.user) {
        return next(new Error("User not found in request object"));
    }

    // Fetch the user
    const user = await users.findOne({ where: { user_id } });

    if (!user) {
        return next(new Error("User not found in database"));
    }

    // Fetch user's location
    const userLocation = await locations.findOne({ where: { user_id } });

    // Check profile media for the user
    const profileMediaCount = await profileMedias.count({ where: { user_id } });

    let isComplete = user.user_name && user.date_of_birth && user.profile_description &&
        userLocation?.latitude && userLocation?.longitude && userLocation?.country && userLocation?.city &&
        profileMediaCount > 0;

    const isCompleteResult = !!isComplete;
    // If the computed value of isComplete is different from what's in the DB, update it.
    if (user.is_profile_complete !== isCompleteResult) {
        await user.update({ is_profile_complete: isCompleteResult });
    }

    req.body.isProfileComplete = isCompleteResult;  // Attach the result to the request object

    next();  // Move to the next middleware/route
}
