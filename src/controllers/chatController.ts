import {logHelper} from "../helper/functionLoggerHelper";
import {sendResponse} from "../helper/sendResponse";
import {isUserPartOfChat} from "../helper/isUserPartOfChat";
import { Server } from 'socket.io';

export const sendVoiceMessage = (io: Server) => async (req: any, res: Response)=> {
    logHelper({level: "INFO", message: "sending message",functionName: "sendVoiceMessage",
        additionalData: JSON.stringify({...req.user, chatRoomId: req.params.chatRoomId, fileLink: req.file?.location})});

    const userId = req.user.userId;
    const chatRoomId = req.params.chatRoomId;
    const fileLink = req.file?.location; // This gets the S3 link after multerS3 upload

    if (!fileLink) {
        return sendResponse(res, 400, false, "Media upload failed. No file link found.", null, null);
    }

    try {
        // Assuming there's a function or method to fetch the recipient ID
        const recipientId = await isUserPartOfChat(chatRoomId, userId);
        if (!recipientId) {
            return sendResponse(res, 400, false, "Recipient not found.", null, "Invalid chat room ID or user is not part of chat room");
        }

        // Emit a message via Socket.io to notify users
        io.emit('newVoiceMessage', {
            senderId: userId,
            fileLink
        });
        return sendResponse(res, 200, true, "Voice message sent.", { fileLink }, null);
    } catch (error:any) {
        console.error("Error sending voice message:", error);
        return sendResponse(res, 500, false, "Error sending voice message.", null, error.message);
    }
}
