import { profileMedias } from '../models/profile_medias'; // Adjust the import to your actual model path

/**
 * Get the maximum media order for a specific user.
 *
 * @param userId - The ID of the user.
 * @returns - The maximum order number or 0 if no media exists.
 */
export const getMaxMediaOrderForUser = async (userId: string): Promise<number> => {
    const result = await profileMedias.findOne({
        where: { user_id: userId },
        order: [['order', 'DESC']], // Order by the 'order' column in descending fashion
        attributes: ['order'], // Only select the 'order' column
        raw: true // Return a plain object, not an instance of the model
    });

    return result?.order || 0; // If no media found, default to 0
};
