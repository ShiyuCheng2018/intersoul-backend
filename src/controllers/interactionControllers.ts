import { Response } from 'express';
import {chats, interactions, users} from "../models/init-models";
import {logHelper} from "../helper/functionLoggerHelper";
import {sendResponse} from "../helper/sendResponse";
import {getKeyByValueFromInteractionTypeEntity} from "../entities/interactionTypeEntity";

export const handleSwipe = async (req: any, res: Response) => {
    logHelper({level: "INFO", message: "committing swipe",functionName: "handleSwipe", additionalData: JSON.stringify(req.user)});
    const userId = req.user.userId; // obtained from jetMiddleware
    const { targetUserId, action } = req.body;

    try {
        // Record the interaction
        await interactions.create({
            user1_id: userId,
            user2_id: targetUserId,
            interaction_type_id: action
        });

        const targetUser = await users.findAll({where: {user_id: targetUserId}});

        // If it's a Like or Superlike, check for a mutual match
        if (action === getKeyByValueFromInteractionTypeEntity("Like") as string|| action === getKeyByValueFromInteractionTypeEntity("Superlike") as string) {
            const mutualInteraction = await interactions.findOne({
                where: {
                    user1_id: targetUserId,
                    user2_id: userId,
                    interaction_type_id: [getKeyByValueFromInteractionTypeEntity("Like") as string,
                        getKeyByValueFromInteractionTypeEntity("Superlike") as string]
                }
            });

            // If a mutual interaction exists, create a chat room for them
            if (mutualInteraction) {
                await chats.create({
                    user1_id: userId,
                    user2_id: targetUserId,
                    last_message_timestamp: new Date() // assuming this is when the chat room was created
                });

                return sendResponse(res, 200, true, "It's a match! Chat room created.", {user: targetUser}, null);
            }
        }

        return sendResponse(res, 200, true, "Interaction recorded.", {user: targetUser}, null);
    } catch (error:any) {
        return sendResponse(res, 500, false, "Error handling swipe action.", null, error.message);
    }
}
