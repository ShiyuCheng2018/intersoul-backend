import {Response} from "express";
import {sendResponse} from "../../../helper/sendResponse";
import {postProfileLocation} from "../../../controllers/profileControllers";
import {locations} from "../../../models/locations";
import {checkProfileCompletionHelper} from "../../../helper/checkProfileCompletionHelper";
import axios from 'axios';
jest.mock('axios');

// Mocks
jest.mock("../../../models/locations", ()=>{
    return {
        locations: {
            upsert: jest.fn(),
            findOne: jest.fn()
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
        // Mock Google Geocoding API response
        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: {
                results: [{
                    address_components: [
                        { types: ["country"], long_name: "Test Country" },
                        { types: ["administrative_area_level_1"], long_name: "Test State" },
                        { types: ["locality"], long_name: "Test City" }
                    ]
                }]
            }
        });

        // Set up other mock implementations
        (locations.upsert as jest.Mock).mockResolvedValueOnce({});
        (locations.findOne as jest.Mock).mockResolvedValueOnce({
            user_id: "123", longitude: 20, latitude: 10, country: "Test Country", state: "Test State", city: "Test City"
        });
        (checkProfileCompletionHelper as jest.Mock).mockResolvedValue(true);

        const req = mockRequest({
            user: { userId: "123" },
            body: {
                longitude: 20,
                latitude: 10,
            }
        });

        await postProfileLocation(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(res, 200, true, "Location updated/added successfully.", { isProfileComplete: true, location: expect.any(Object) }, null);
    });

    it("should handle errors during location update/add", async () => {
        // Mock an error during upsert
        const mockError = new Error("Cannot read properties of undefined (reading 'data')");
        (locations.upsert as jest.Mock).mockRejectedValueOnce(mockError);

        const req = mockRequest({
            user: { userId: "123" },
            body: {
                longitude: 20,
                latitude: 10,
            }
        });

        await postProfileLocation(req, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(
            res,
            500,
            false,
            "Failed to handle location",
            null,
            mockError.message
        );
    });

});
