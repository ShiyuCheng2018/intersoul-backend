import { Server, Socket } from 'socket.io';
import { messages, chats } from '../../models/init-models';
import {isUserPartOfChat} from "../../helper/isUserPartOfChat";
import {getKeyByValueFromMediaTypeEntity} from "../../entities/mediaTypeEntity";
import {InterSoulSocket} from "../socketHandler";  // Assuming you have sequelize models set up in a models file or folder.
import {Op} from "sequelize";

export enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read"
}

export enum ContentStatus {
    AVAILABLE = "available",
    VIEWED_ONCE = "viewed_once",
    EXPIRED = "expired"
}



export default function (socket: InterSoulSocket, io: Server){

    socket.on('joinChat', (chatRoomId: string) => {
        socket.join(chatRoomId);
        socket.chatRoom = chatRoomId;  // Storing chat room ID on the socket for convenience
    });

    socket.on('newVoiceMessage', async (data: { voiceLink: string, senderId: string }) => {
        const recipient = await isUserPartOfChat(socket.chatRoom as string, data.senderId);
        if (!recipient) {
            socket.emit('error', { message: 'You are not part of this chat.' });
            return;
        }

        try {
            const message = await messages.create({
                chat_id: socket.chatRoom as string,
                sender_id: data.senderId,
                recipient_id: recipient,
                content_type_id: getKeyByValueFromMediaTypeEntity("Voice") as string,
                content_link: data.voiceLink,
                content_status: ContentStatus.AVAILABLE,
                message_status: MessageStatus.SENT,
                sent_at: new Date(),
            });


            // Emit to the chat room
            io.to(socket.chatRoom as string).emit("voiceMessageReceived", {
                sender: data.senderId,
                voiceLink: data.voiceLink
            });
            // Update the message status to 'delivered' now that it has been sent to the client
            await message.update({ message_status: 'delivered' }, { where: { message_id: message.message_id }});

            // Notify the sender that the message has been delivered
            io.to(data.senderId).emit("messageDelivered", { messageId: message.message_id });

        } catch (error) {
            console.error('Error sending voice message:', error);
            socket.emit('error', { message: 'Failed to send voice message. Try again later.' });
        }
    });

    socket.on('messagesRead', async (data:{chatRoomId:string, recipientId: string}) => {
        try {
            const updatedMessages = await messages.update({ message_status: 'read' }, {
                where: {
                    chat_id: data.chatRoomId,
                    recipient_id: data.recipientId,
                    message_status: {[Op.ne]: MessageStatus.READ}
                },
                returning: true
            });
            // Notify the sender that the message has been read
            const senderId = updatedMessages[1][0]?.sender_id;
            if (senderId) {
                io.to(senderId).emit("messageRead", { chatId: data.chatRoomId });
            }
        } catch (error) {
            console.error("Error updating message status to read:", error);
        }
    });

    socket.on('leaveChat', (chatRoomId: string) => {
        socket.leave(chatRoomId);
        // You can also emit an event here if you want other members of the chat room to know that someone left
        io.to(chatRoomId).emit("userLeft", { userId: socket.userId});  // Assuming you have userId on the socket
    });
}

