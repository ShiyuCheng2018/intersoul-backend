import {Response} from "express";
import {sendResponse} from "../../../helper/sendResponse";
import {preferences} from "../../../models/init-models";
import {putPreferences} from "../../../controllers/profileControllers";

// Mocks
jest.mock("../../../models/init-models", ()=>({
    preferences: {
        findOne: jest.fn(),
    }
}));
jest.mock('../../../helper/sendResponse', () => ({
    sendResponse: jest.fn(),
}));

const mockRequest = (data: any) => data;

describe("putPreferences", () => {

    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it("should successfully update preferences", async () => {
        // Mock preferences to simulate that a record exists
        const mockPreference = {
            save: (jest.fn() as jest.Mock).mockResolvedValue(true)
        };
        (preferences.findOne as jest.Mock).mockResolvedValue(mockPreference);

        const req = mockRequest({
            user: { userId: "123" },
            body: {
                min_age: 20,
                max_age: 30,
                // ... add other properties here
            }
        });

        await putPreferences(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 200, true, "Preferences updated successfully.");
    });

    it("should handle no preference record found", async () => {
        // Mock no preference record found
        (preferences.findOne as jest.Mock).mockResolvedValueOnce(null);

        const req = mockRequest({
            user: { userId: "123" },
            body: {
                min_age: 20,
                max_age: 30,
                // ... add other properties here
            }
        });

        await putPreferences(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 404, false, "No preference record found for the user.");
    });

    it("should handle errors during preference updating", async () => {
        // Mock an error during updating
        const mockError = new Error("Update error");
        const mockPreference = {
            save: jest.fn().mockRejectedValueOnce(mockError)
        };
        (preferences.findOne as jest.Mock).mockResolvedValueOnce(mockPreference);

        const req = mockRequest({
            user: { userId: "123" },
            body: {
                min_age: 20,
                max_age: 30,
                // ... add other properties here
            }
        });

        await putPreferences(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 500, false, "Error updating preferences.", null, mockError.message);
    });
});
