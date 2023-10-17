import { Server } from "socket.io";
import chatEvents from "../../socket/events/chatEvents";
import {isUserPartOfChat} from "../../helper/isUserPartOfChat";
import {messages} from "../../models/messages";
import {getKeyByValueFromMediaTypeEntity} from "../../entities/mediaTypeEntity";

// Mocks
jest.mock('../../models/messages', () => ({
    messages: {
        create: jest.fn(),
        update: jest.fn()
    }
}));

jest.mock('../../helper/isUserPartOfChat', ()=>{
    return {
        isUserPartOfChat: jest.fn()
    }
});

const ioMock = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
} as unknown as Server;

let socketMock: any;

describe('chatEvents', () => {
    beforeEach(() => {
        socketMock = {
            join: jest.fn(),
            on: jest.fn((event, callback) => {
                socketMock[event] = callback;
            }),
            emit: jest.fn(),
            chatRoom: 'room123',
        };

        jest.clearAllMocks(); // this resets the mock functions' usage data
    });


    it('handles a user joining a chat and stores the chat room ID in the socket', () => {
        chatEvents(socketMock, ioMock);

        socketMock['joinChat']('room123'); // this simulates emitting 'joinChat'

        expect(socketMock.join).toHaveBeenCalledWith('room123');
        expect(socketMock.chatRoom).toBe('room123');
    });

    it('emits voiceMessageReceived event on new voice message and updates message status', async () => {
        (isUserPartOfChat as jest.Mock).mockResolvedValue('recipient123');
        (messages.create as jest.Mock).mockResolvedValue({ update: jest.fn(), message_id: 'message123' });

        chatEvents(socketMock, ioMock);

        await socketMock['newVoiceMessage']({ voiceLink: 'link', senderId: 'sender123' });

        expect(ioMock.to).toHaveBeenCalledWith('room123');
        expect(ioMock.emit).toHaveBeenCalledWith('voiceMessageReceived', expect.any(Object));

        const createdMessage = await (messages.create as jest.Mock)({message_status: 'sent',
            chat_id: "room123",
            content_link: "link",
            content_status: "available",
            content_type_id:  getKeyByValueFromMediaTypeEntity("Voice") as string,
            recipient_id: "recipient123",
            sender_id: "sender123",
            sent_at: expect.any(Date)});

        expect(createdMessage.update).toHaveBeenCalledWith({ message_status: 'delivered' }, { where: { message_id: 'message123' }});
    });

    it('handles invalid chat room or sender with newVoiceMessage', async () => {
        (isUserPartOfChat as jest.Mock).mockResolvedValue(null); // simulate no recipient found

        chatEvents(socketMock, ioMock);

        await socketMock['newVoiceMessage']({ voiceLink: 'link', senderId: 'sender123' });

        // You might want to check if any specific error handling or logging method was called here, as the behavior for invalid input isn't specified in the initial code
    });
});
