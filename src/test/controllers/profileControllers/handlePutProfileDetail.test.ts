import {sendResponse} from "../../../helper/sendResponse";
import {users} from "../../../models/users";
import { Response } from "express";
import {checkProfileCompletionHelper} from "../../../helper/checkProfileCompletionHelper";
import {putProfileDetails} from "../../../controllers/profileControllers";

// Mocks
jest.mock("../../../models/users", ()=>(
    {   users:{
            findByPk: jest.fn(),
        }
    }
));
jest.mock('../../../helper/checkProfileCompletionHelper', () => ({checkProfileCompletionHelper: jest.fn()}));

jest.mock('../../../helper/sendResponse', () => ({
    sendResponse: jest.fn(),
}));

const mockRequest = (data: any) => data;

describe("putProfileDetails", () => {

    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it("should handle unauthorized requests", async () => {
        const req = mockRequest({});
        await putProfileDetails(req, res as Response);
        expect(sendResponse).toHaveBeenCalledWith(res, 401, false, "authorization denied", null, null);
    });

    it("should handle missing required fields", async () => {
        const req = mockRequest({ user: { userId: "123" }, body: {} });
        await putProfileDetails(req, res as Response);
        expect(sendResponse).toHaveBeenCalledWith(res, 400, false, "Required fields are missing", null, null);
    });

    it("should handle user not found scenario", async () => {
        (users.findByPk as jest.Mock).mockResolvedValue(null);
        const req = mockRequest({
            user: { userId: "nonexistent-user" },
            body: { userName: "John", dateOfBirth: "2000-01-01", genderId: "1", profileDescription: "test" }
        });
        await putProfileDetails(req, res as Response);
        expect(sendResponse).toHaveBeenCalledWith(res, 404, false, "User not found", null, null);
    });

    it("should successfully update profile details", async () => {
        const mockUser = {
            save: jest.fn()
        };
        (users.findByPk as jest.Mock).mockResolvedValue(mockUser);
        (checkProfileCompletionHelper as jest.Mock).mockResolvedValue(true);

        const req = mockRequest({
            user: { userId: "123" },
            body: { userName: "John", dateOfBirth: "2000-01-01", genderId: "1", profileDescription: "test" }
        });
        await putProfileDetails(req, res as Response);
        expect(sendResponse).toHaveBeenCalledWith(res, 200, true, "Profile details updated successfully", { isProfileComplete: true }, null);
    });

    it("should handle errors during profile update", async () => {
        const mockError = new Error("test error");
        (users.findByPk as jest.Mock).mockRejectedValue(mockError);

        const req = mockRequest({
            user: { userId: "123" },
            body: { userName: "John", dateOfBirth: "2000-01-01", genderId: "1", profileDescription: "test" }
        });
        await putProfileDetails(req, res as Response);
        expect(sendResponse).toHaveBeenCalledWith(res, 500, false, "An error occurred while updating profile details", null, mockError.message);
    });
});
