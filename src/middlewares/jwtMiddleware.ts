import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {oauth} from "../models/oauth";
import {users} from "../models/users";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const token = req.header('Authorization')?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({message: "authorization denied"});
    }
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            decoded = jwt.decode(token) as JwtPayload;

            try {
                const tokenData = await oauth.findOne({where: {user_id: decoded.userId}});

                if (!tokenData) {
                    return res.status(401).json({message: "User not found"});
                }

                const {refresh_token, expiry_date} = tokenData;
                if (new Date() > expiry_date) {
                    return res.status(401).json({message: "Refresh token expired"});
                }

                const decodedRefreshToken = jwt.verify(refresh_token, JWT_REFRESH_SECRET) as JwtPayload;

                // If everything is okay, re-issue a new JWT.
                const user = await users.findOne({where: {user_id: decodedRefreshToken.userId}}) as users;

                const payload = {
                    userId: user.user_id,
                    email: user.email
                };

                const newAccessToken = jwt.sign(payload, JWT_SECRET, {
                    expiresIn: '15m'
                });
                // Update the access token in the database
                await oauth.update({access_token: newAccessToken}, {where: {user_id: user.user_id}});

                // Attach the new access token to the response
                res.setHeader('Access-Token', newAccessToken);
                req.user = payload;

                next();
            }catch (err:any) {
                if(err.name === "TokenExpiredError"){
                    res.status(401).json({ message: "Token is expired and refresh token is not valid" });
                }
            }
        }else {
            res.status(401).json({ message: "Token is not valid" });
        }
    }
};
