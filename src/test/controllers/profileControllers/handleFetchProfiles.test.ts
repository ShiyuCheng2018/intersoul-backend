import {users} from "../../../models/users";
import {fetchProfiles} from "../../../controllers/profileControllers";
import {sendResponse} from "../../../helper/sendResponse";
import {Response} from "express";
import {interactions, preferences} from "../../../models/init-models";
import {Op} from "sequelize";

jest.mock("../../../models/users", ()=>{
    return {
        users: {
            findOne: jest.fn(),
            findAll: jest.fn(),
        }
    }
});
jest.mock("../../../models/init-models", ()=>{
    return {
        preferences: {
            findOne: jest.fn(),
        },
        interactions: {
            findAll: jest.fn(),
        }
    }
});

jest.mock("../../../helper/sendResponse", ()=>{
    return {
        sendResponse: jest.fn(),
    }
});

const mockRequest = (data: any) => data;

describe("fetchProfiles", () => {
    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle the case when the user is not found", async () => {
        (users.findOne as jest.Mock).mockResolvedValueOnce(null);
        const req = mockRequest({ user: { userId: "test-id" } });

        await fetchProfiles(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 404, false, "User not found.", [], "User not found.");
    });

    it("should handle when the user's profile is not complete", async () => {
        (users.findOne as jest.Mock).mockResolvedValueOnce({ is_profile_complete: false });
        const req = mockRequest({ user: { userId: "test-id" } });

        await fetchProfiles(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 200, true, "Complete your profile to see others and to be seen.", []);
    });

    it("should handle when no preference record is found for the user", async () => {
        (users.findOne as jest.Mock).mockResolvedValueOnce({ is_profile_complete: true });
        (preferences.findOne as jest.Mock).mockResolvedValueOnce(null);
        const req = mockRequest({ user: { userId: "test-id" } });

        await fetchProfiles(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 404, false, "No preference record found for the user.", []);
    });

    it("should handle successful profile fetch", async () => {
        (users.findOne as jest.Mock).mockResolvedValueOnce({ is_profile_complete: true });
        (preferences.findOne as jest.Mock).mockResolvedValueOnce({ gender_preference_id: "male", body_type_preference_id: "athletic", min_age: 20, max_age: 30 });
        (interactions.findAll as jest.Mock).mockResolvedValueOnce([]);
        (interactions.findAll as jest.Mock).mockResolvedValueOnce([]);
        (users.findAll as jest.Mock).mockResolvedValueOnce([{ user_id: "test-user-2", name: "John Doe", age:21}]);

        const req = mockRequest({ user: { userId: "test-id" } });

        await fetchProfiles(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 200, true, "Profiles fetched successfully.", { user: [{ user_id: "test-user-2", name: "John Doe", age:21}] });
    });

    it("should filter profiles based on height preferences", async () => {
        (users.findOne as jest.Mock).mockResolvedValueOnce({ is_profile_complete: true });
        (preferences.findOne as jest.Mock).mockResolvedValueOnce({ min_height: 160, max_height: 180 });
        (interactions.findAll as jest.Mock).mockResolvedValueOnce([]);
        (interactions.findAll as jest.Mock).mockResolvedValueOnce([]);
        (users.findAll as jest.Mock).mockResolvedValueOnce([{ user_id: "test-user-2", name: "John Doe" }]);

        const req = mockRequest({ user: { userId: "test-id" } });

        await fetchProfiles(req, res as Response);

        expect(users.findAll).toHaveBeenCalledWith({ where: expect.objectContaining({ height: { [Op.between]: [160, 180] } }) });
    });

    it("should exclude users that the current user has interacted with", async () => {
        (users.findOne as jest.Mock).mockResolvedValueOnce({ is_profile_complete: true });
        (preferences.findOne as jest.Mock).mockResolvedValueOnce({});
        (interactions.findAll as jest.Mock).mockResolvedValueOnce([{ user2_id: "user-interacted" }]);
        (interactions.findAll as jest.Mock).mockResolvedValueOnce([]);
        (users.findAll as jest.Mock).mockResolvedValueOnce([{ user_id: "test-user-2", name: "John Doe" }]);

        const req = mockRequest({ user: { userId: "test-id" } });

        await fetchProfiles(req, res as Response);

        expect(users.findAll).toHaveBeenCalledWith({ where: expect.objectContaining({ user_id: { [Op.notIn]: ["user-interacted", "test-id"] } }) });
    });

    it("should exclude users who unmatched with the current user", async () => {
        (users.findOne as jest.Mock).mockResolvedValueOnce({ is_profile_complete: true });
        (preferences.findOne as jest.Mock).mockResolvedValueOnce({});
        (interactions.findAll as jest.Mock).mockResolvedValueOnce([]);
        (interactions.findAll as jest.Mock).mockResolvedValueOnce([{ user1_id: "user-unmatched" }]);
        (users.findAll as jest.Mock).mockResolvedValueOnce([{ user_id: "test-user-2", name: "John Doe" }]);

        const req = mockRequest({ user: { userId: "test-id" } });

        await fetchProfiles(req, res as Response);

        expect(users.findAll).toHaveBeenCalledWith({ where: expect.objectContaining({ user_id: { [Op.notIn]: ["user-unmatched", "test-id"] } }) });
    });

    it("should handle errors during fetching profiles", async () => {
        (users.findOne as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
        const req = mockRequest({ user: { userId: "test-id" } });

        await fetchProfiles(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 500, false, "Error fetching profiles.", null, "DB Error");
    });

    // Continue with other test cases, such as:
    // - User with certain age preferences.
    // - User with certain height preferences.
    // - User that has interacted with certain other users.
    // - User that has been unmatched by certain other users.
    // ... and any other scenarios specific to your application's logic.
});
