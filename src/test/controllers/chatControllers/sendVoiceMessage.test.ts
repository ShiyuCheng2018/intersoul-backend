import { Server } from 'socket.io';
import {sendVoiceMessage} from "../../../controllers/chatController";
import {isUserPartOfChat} from "../../../helper/isUserPartOfChat";

jest.mock('../../../helper/isUserPartOfChat', ()=>{
    return {
        isUserPartOfChat: jest.fn()
    }
});

const mockRequest = (data: any) => data;

describe('sendVoiceMessage', () => {
    let io: Server;
    let req: any;
    let res: Response;

    beforeEach(() => {
        io = { emit: jest.fn() } as any;  // mock emit function of the Server class
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;
    });

    it('responds with an error when the recipient is not found', async () => {
        (isUserPartOfChat as jest.Mock).mockResolvedValueOnce(null);
        req = mockRequest({
            user: { userId: '12345' },
            params: { chatRoomId: 'chat123' },
            file: { location: 'fileLink' }
        });

        await sendVoiceMessage(io as Server)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            code: 400,
            success: false,
            data: null,
            message: "Recipient not found.",
            errors: "Invalid chat room ID or user is not part of chat room"
        });
    });

    it('emits the correct event on successful voice message', async () => {
        (isUserPartOfChat as jest.Mock).mockResolvedValueOnce('recipient123');

        req = mockRequest({
            user: { userId: '12345' },
            params: { chatRoomId: 'chat123' },
            file: { location: 'fileLink' }
        });

        await sendVoiceMessage(io as Server)(req, res);

        expect(io.emit).toHaveBeenCalledWith('newVoiceMessage', {
            senderId: '12345',
            fileLink: 'fileLink'
        });
    });

    it('responds with an error when there\'s no fileLink', async () => {
        req = mockRequest({
            user: { userId: '12345' },
            params: { chatRoomId: 'chat123' },
            file: {}
        });

        await sendVoiceMessage(io)(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ code: 400,data:null, errors: null, success: false, message: "Media upload failed. No file link found." });
    });

    it('responds correctly to a valid voice message upload', async () => {
        (isUserPartOfChat as jest.Mock).mockResolvedValueOnce('recipient123');

        req = mockRequest({
            user: { userId: '12345' },
            params: { chatRoomId: 'chat123' },
            file: { location: 'fileLink' }
        });

        await sendVoiceMessage(io)(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            code: 200,
            success: true,
            errors: null,
            message: "Voice message sent.",
            data: { fileLink: 'fileLink' }
        });
    });

    it('handles error when there\'s an exception', async () => {
        // Mock the isUserPartOfChat function to throw an error
        (isUserPartOfChat as jest.Mock).mockRejectedValueOnce(new Error('Mock error'));

        req = mockRequest({
            user: { userId: '12345' },
            params: { chatRoomId: 'chat123' },
            file: { location: 'fileLink' }
        });

        await sendVoiceMessage(io)(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            code: 500,
            errors: 'Mock error',
            data: null,
            message: "Error sending voice message.",
        });
    });

    // You can also write a test to check the behavior when the chat room ID or user ID is invalid.
    // This would be similar to the test above but would involve mocking `isUserPartOfChat` to return a falsy value.
});
