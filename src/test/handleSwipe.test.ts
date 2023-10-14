import { Response } from 'express';
import {handleSwipe} from '../controllers/interactionControllers';
import { interactions, chats } from '../models/init-models';
import {getKeyByValueFromInteractionTypeEntity} from "../entities/interactionTypeEntity";

type HandleSwipeRequest = {
    user: {
        userId: string;
    },
    body: {
        targetUserId: string;
        action: string;
    }
}

// Mocking the database models
jest.mock('../models/init-models', () => ({
    interactions: {
        create: jest.fn(),
        findOne: jest.fn(),
    },
    users: {
        findAll: jest.fn(),
    },
    chats: {
        create: jest.fn(),
    },
}));

// A mock implementation of the sendResponse function
const sendResponse = jest.fn();

const mockRequest = (data: HandleSwipeRequest) => ({
    ...data
});


const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe('handleSwipe', () => {
    const userId = "user-id";
    const targetUserId = "target-user-id";

    beforeEach(() => {
        // Reset mocks before each test
        jest.resetAllMocks();
    });

    it('should record a successful interaction', async () => {
        const req = mockRequest({
            user: {
                userId,
            },
            body: {
                targetUserId,
                action: getKeyByValueFromInteractionTypeEntity("Like") as string,
            },
        });
        const res = mockResponse();

        await handleSwipe(req, res);

        expect(interactions.create).toHaveBeenCalledWith({
            user1_id: userId,
            user2_id: targetUserId,
            interaction_type_id: getKeyByValueFromInteractionTypeEntity("Like") as string,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Interaction recorded." }));
    });

    it('should handle errors gracefully', async () => {
        // Force interactions.create to throw an error
        (interactions.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

        const req = mockRequest({
            user: {
                userId,
            },
            body: {
                targetUserId,
                action: getKeyByValueFromInteractionTypeEntity("Like") as string,
            },
        });
        const res = mockResponse();

        await handleSwipe(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error handling swipe action." }));
    });

    it('should create a chat room on mutual match', async () => {
        // Mock that the target user has previously "Liked" the current user
        (interactions.findOne as jest.Mock).mockResolvedValueOnce({
            user1_id: targetUserId,
            user2_id: userId,
            interaction_type_id: getKeyByValueFromInteractionTypeEntity("Like") as string,
        });

        const req = mockRequest({
            user: {
                userId,
            },
            body: {
                targetUserId,
                action: getKeyByValueFromInteractionTypeEntity("Like") as string,
            },
        });
        const res = mockResponse();

        await handleSwipe(req, res);

        // Expectation: Check if a chat room is created for these two users
        expect(chats.create).toHaveBeenCalledWith({
            user1_id: userId,
            user2_id: targetUserId,
            last_message_timestamp: expect.any(Date),
        });

        // Expectation: Send a response indicating a successful match
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "It's a match! Chat room created." }));
    });
});
