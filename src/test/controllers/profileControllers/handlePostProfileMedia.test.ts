import {Response} from "express";
import {postProfileMedia} from "../../../controllers/profileControllers";
import {sendResponse} from "../../../helper/sendResponse";
import {getMaxMediaOrderForUser} from "../../../helper/profileHelper";
import {getKeyByValueFromMediaTypeEntity} from "../../../entities/mediaTypeEntity";
import {profileMedias} from "../../../models/init-models";
import {checkProfileCompletionHelper} from "../../../helper/checkProfileCompletionHelper";


// Mocking external functions
jest.mock('../../../helper/profileHelper', () => ({getMaxMediaOrderForUser: jest.fn()}));
jest.mock('../../../models/profile_medias', () => ({
    profileMedias:{
        create: jest.fn(),
        findAll: jest.fn(),
    }
}));
jest.mock('../../../helper/sendResponse', () => ({
    sendResponse: jest.fn(),
}));
jest.mock('../../../helper/checkProfileCompletionHelper', () => ({checkProfileCompletionHelper: jest.fn()}));

// Mock implementations for request and response objects
const mockRequest = (data: any = {}) => ({
    ...data
});

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockImplementation((code) => {
        console.log(`Status code: ${code}`);
        return res;
    });
    res.json = jest.fn().mockImplementation((data) => {
        console.log(`JSON data: ${JSON.stringify(data)}`);
        return res;
    });
    return res as Response;
};

const next = jest.fn();

describe('postProfileMedia', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('returns 400 if no file is attached', async () => {
        const req = mockRequest({
            user: { userId: 'test-user-id' },
            file: null
        });
        const res = mockResponse();

        await postProfileMedia(req, res, next);

        expect(sendResponse).toHaveBeenCalledWith(res, 400, false, 'No files uploaded.', null, null);
    });

    it('returns 400 if maximum media upload count is reached', async () => {

        (getMaxMediaOrderForUser as jest.Mock).mockResolvedValueOnce(6);

        const req = mockRequest({
            user: { userId: 'test-user-id' },
            file: { location: 'test-location' }
        });
        const res = mockResponse();

        await postProfileMedia(req, res, next);

        expect(sendResponse).toHaveBeenCalledWith(res, 400, false, 'You reached the maximum profile media uploading.', null, null);
    });

    it('returns 200 on successful media upload and insert', async () => {
        jest.clearAllMocks()
        const req = mockRequest({
            user: { userId: 'test-user-id' },
            file: { location: 'test-location' },
            body: { mediaType: getKeyByValueFromMediaTypeEntity("Image") }
        });
        const res = mockResponse();

        (getMaxMediaOrderForUser as jest.Mock).mockResolvedValue(2);
        (profileMedias.create as jest.Mock).mockResolvedValue(true);
        (profileMedias.findAll as jest.Mock).mockResolvedValue([{ media_path: 'test-location-1' }, { media_path: 'test-location-2' }]);
        (checkProfileCompletionHelper as jest.Mock).mockResolvedValue(true);

        await postProfileMedia(req, res, next);

        expect(sendResponse).toHaveBeenCalledWith(res, 200, true, 'Media uploaded successfully', expect.objectContaining({
            userProfileMedias: [{ media_path: 'test-location-1' }, { media_path: 'test-location-2' }],
            isProfileComplete: true
        }), null);
    });


    it('forwards error to the next middleware on failure', async () => {
        (getMaxMediaOrderForUser as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

        const req = mockRequest({
            user: { userId: 'test-user-id' },
            file: { location: 'test-location' }
        });
        const res = mockResponse();

        await postProfileMedia(req, res, next);

        expect(next).toHaveBeenCalledWith(new Error('Test error'));
    });
});
