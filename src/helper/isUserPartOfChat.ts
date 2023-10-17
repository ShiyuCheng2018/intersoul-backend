import {chats} from "../models/chats";
export async function isUserPartOfChat(chatRoomId: string, userId: string): Promise<string | null> {
    try {
        const chat = await chats.findOne({ where: { chat_id: chatRoomId } });

        if (!chat) {
            return null;  // No chat found with the given ID
        }

        if (chat.user1_id === userId) {
            return chat.user2_id;
        } else if (chat.user2_id === userId) {
            return chat.user1_id;
        } else {
            return null;  // User is not part of this chat
        }

    } catch (error) {
        console.error("Error checking user chat membership:", error);
        return null;
    }
}
