import { Response } from "express";
import {profileMedias} from "../../../models/init-models";
import {checkProfileCompletionHelper} from "../../../helper/checkProfileCompletionHelper";
import {deleteProfileMedia} from "../../../controllers/profileControllers"; // Assuming you're using Sequelize

jest.mock('../helper/checkProfileCompletionHelper', () => ({checkProfileCompletionHelper: jest.fn()}));
jest.mock('../models/profile_medias', () => ({
    profileMedias:{
        create: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
        findOne:jest.fn(),
        update:jest.fn(),
    }
}));
// Mocking AWS SDK (if you're using it)
// jest.mock("aws-sdk");

const mockRequest = (data: any = {}) => ({
    ...data
});
const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe("deleteProfileMedia", () => {
    it("should delete media and return 200", async () => {
        const req = mockRequest({
            user: { userId: 'test-user-id' },
            params: { mediaId: 'test-media-id' },
        });
        const res = mockResponse();
        const next = jest.fn();

        // Mocking the findOne function to return a media
        (profileMedias.findOne as jest.Mock).mockResolvedValue({ profile_media_id: 'test-media-id', order: 3, media_path: 'test-path' });
        // Mocking the destroy function
        (profileMedias.destroy as jest.Mock).mockResolvedValue(1); // Assuming 1 row is deleted
        // Mocking the update function
        (profileMedias.update as jest.Mock).mockResolvedValue([1]); // Assuming 1 row is updated
        // Mocking the checkProfileCompletionHelper function
        (checkProfileCompletionHelper as jest.Mock).mockResolvedValue(true);

        await deleteProfileMedia(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            message: "Media deleted successfully",
        }));
    });

    it("should return 404 if media not found", async () => {
        const req = mockRequest({
            user: { userId: 'test-user-id' },
            params: { mediaId: 'test-media-id' },
        });
        const res = mockResponse();
        const next = jest.fn();

        // Mocking the findOne function to return null (media not found)
        (profileMedias.findOne as jest.Mock).mockResolvedValue(null);

        await deleteProfileMedia(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: "Media not found",
        }));
    });

    // Add more tests as required, for example:
    // - Test error handling if there's a Sequelize error.
    // - Test the interaction with AWS SDK (if you're using it) for deleting the media from S3.
    // - Test behavior when the `checkProfileCompletionHelper` returns false.
});
