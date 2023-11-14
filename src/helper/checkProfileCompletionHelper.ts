import {locations} from "../models/locations";
import {profileMedias} from "../models/profile_medias";
import {users} from '../models/users';
import {preferences} from "../models/init-models";
export const checkProfileCompletionHelper = async (userId: string):Promise<Boolean> =>{

    const user = await users.findOne({ where: {  user_id: userId} });
    if(!user){
        return false;
    }
    // Fetch user's location
    const userLocation = await locations.findOne({ where: { user_id: userId } });
    const userPreferences = await preferences.findOne({ where: { user_id: userId } });
    // Check profile media for the user
    const profileMediaCount = await profileMedias.count({ where: { user_id: userId } });

    let isComplete = user!.user_name!.length > 0 && user.date_of_birth && user.profile_description
        && (user as any).gender_id.length > 0 && (userPreferences as any).gender_preference_id.length > 0
        && userLocation?.latitude && userLocation?.longitude && userLocation?.country &&
        userLocation?.city && profileMediaCount > 0;

    // console.log(user?.user_name, user?.date_of_birth, user?.profile_description,
    //     user?.height, user?.body_type_id, userLocation?.latitude, userLocation?.longitude, userLocation?.country,
    //     userLocation?.city , profileMediaCount > 0)

    const isCompleteResult = !!isComplete;
    // If the computed value of isComplete is different from what's in the DB, update it.
    if (user?.is_profile_complete !== isCompleteResult) {
        await user?.update({ is_profile_complete: isCompleteResult });
    }

    return isCompleteResult;
}
