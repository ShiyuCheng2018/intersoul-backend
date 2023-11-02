import passport from "passport";
import {NextFunction} from "express";
import {oauth} from "../models/oauth";
import jwt from "jsonwebtoken";
import {logHelper} from "../helper/functionLoggerHelper";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

// JWT Middleware
export const jwtMiddleware = async (req:any, res:any, next:NextFunction) => {
    logHelper({ level: "INFO", message: "JWT Middleware", functionName: "jwtMiddleware", additionalData: JSON.stringify(req.user) });

    // Decode JWT to get userId
    const decoded = jwt.decode(req.header('Authorization')?.split('Bearer ')[1]) as any;

    if (!decoded || !decoded.userId) {
        return res.status(401).send('Invalid token.');
    }else {
        const tokenData = await oauth.findOne({ where: { user_id: decoded.userId } });
        if (tokenData!.access_token !== req.header('Authorization')?.split('Bearer ')[1]){
            return res.status(401).send('Expired access token.');
        }
    }

    passport.authenticate('jwt', { session: false }, (err:any, user:any, info:any) => {
        if (err) {
            return res.status(500).send('Internal server error');
        }

        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};

// Refresh Middleware
export const refreshMiddleware = async (req: any, res: any, next: NextFunction) => {
    logHelper({ level: "INFO", message: "Refresh Middleware", functionName: "refreshMiddleware", additionalData: JSON.stringify(req.user) });
    // If req.user exists, this means JWT was valid and there's no need to refresh.
    if (req.user) {
        return next();
    }

    // If JWT is expired, attempt to refresh
    if (!req.header('Authorization')) {
        return res.status(401).send('No authorization token found.');
    }


    // Decode JWT to get userId
    const decoded = jwt.decode(req.header('Authorization')?.split('Bearer ')[1]) as any;

    if (!decoded || !decoded.userId) {
        return res.status(401).send('Invalid token.');
    }

    try {
        const tokenData = await oauth.findOne({ where: { user_id: decoded.userId } });

        if (!tokenData) {
            return res.status(401).send('Invalid token data.');
        }

        const { refresh_token, expiry_date } = tokenData;

        if (new Date() > expiry_date) {
            return res.status(401).send('Refresh token expired. Please log in again.');
        }

        // Validate refresh token
        const decodedRefreshToken: any = jwt.verify(refresh_token, JWT_REFRESH_SECRET);

        const payload = {
            userId: decodedRefreshToken.userId,
            email: decodedRefreshToken.email
        };

        const newAccessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '15m'
        });

        // Update the access token in the database
        await oauth.update({ access_token: newAccessToken }, { where: { user_id: decodedRefreshToken.userId } });

        // Attach the new access token to the request for the next middleware
        req.headers.authorization = 'Bearer ' + newAccessToken;
        res.setHeader('X-New-Access-Token', newAccessToken);
        // Set the user in the request for subsequent middlewares
        req.user = payload;

        next();
    } catch (err) {
        return res.status(401).send('Error refreshing token.');
    }
};
