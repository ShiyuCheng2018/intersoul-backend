import passport from 'passport';
import {preferences} from "../models/preferences";
import {sendResponse} from "../helper/sendResponse";
import {logHelper} from "../helper/functionLoggerHelper";

export const login = (req: any, res: any, next: any) => {
    logHelper({ level: "INFO", message: "Trying to login", functionName: "login", additionalData: JSON.stringify(req.user)})
    passport.authenticate('local-login', (err: any, authObject: any, info: any) => {
        if (err) {
            return next(err);  // Error during authentication
        }
        if (!authObject) {
            // Authentication failed
            return sendResponse(res, 401, false, info.message);
        }

        const { user, accessToken } = authObject;

        // Authentication succeeded
        return sendResponse(res, 200, true, "User logged in successfully.", {user, accessToken}, null);
    })(req, res, next);
};

export const signup =(req:any, res:any, next:any) => {
    logHelper({ level: "INFO", message: "Trying to signup", functionName: "signup", additionalData: JSON.stringify(req.user) });
    passport.authenticate('local-signup', async (err:any, authObject:any, info:any) => {
        if (err) {
            return next(err);
        }
        if (!authObject) {
            return sendResponse(res, 400, false, info.message);
        }

        const { newUser, accessToken } = authObject;

        // Set default preferences for the user
        try {
            await preferences.create({
                user_id: newUser.dataValues.user_id,
                min_age: 18,
                max_age: 100,
                min_distance: 0,
                max_distance: 100,
                min_height: 0,
                max_height: 300,
            });
        } catch (error:any) {
            return sendResponse(res, 500, false, "Error setting default preferences.", null, error.message);
        }

        // Optionally log the user in or send a success message
        return sendResponse(res, 201, true, "User created successfully.", {user: newUser, accessToken}, null);
    })(req, res, next);
};

