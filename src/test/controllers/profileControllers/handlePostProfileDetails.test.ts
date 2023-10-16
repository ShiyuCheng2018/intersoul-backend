import {Response} from "express";
import {sendResponse} from "../../../helper/sendResponse";
import {postProfileLocation} from "../../../controllers/profileControllers";
import {locations} from "../../../models/locations";
import {checkProfileCompletionHelper} from "../../../helper/checkProfileCompletionHelper";

// Mocks
jest.mock("../../../models/locations", ()=>{
    return {
        locations: {
            upsert: jest.fn(),
        }
    }
});
jest.mock('../../../helper/checkProfileCompletionHelper', () => ({checkProfileCompletionHelper: jest.fn()}));
jest.mock('../../../helper/sendResponse', () => ({
    sendResponse: jest.fn(),
}));
const mockRequest = (data: any) => data;

describe("postProfileLocation", () => {

    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it("should successfully update or add location", async () => {
        // Set up mock implementations
        (locations.upsert as jest.Mock).mockResolvedValue(1); // Mocks successful upsert
        (checkProfileCompletionHelper as jest.Mock).mockResolvedValue(true); // Mocks profile completion check

        const req = mockRequest({
            user: { userId: "123" },
            body: {
                longitude: 20,
                latitude: 10,
                country: "Country",
                state: "State",
                city: "City"
            }
        });

        await postProfileLocation(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 200, true, "Location updated/added successfully.", { isProfileComplete: true }, null);
    });

    it("should handle errors during location update/add", async () => {
        // Mock an error during upsert
        const mockError = new Error("Upsert error");
        (locations.upsert as jest.Mock).mockRejectedValueOnce(mockError);

        const req = mockRequest({
            user: { userId: "123" },
            body: {
                longitude: 20,
                latitude: 10,
                country: "Country",
                state: "State",
                city: "City"
            }
        });

        await postProfileLocation(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 500, false, "Failed to handle location", null, mockError.message);
    });
});
