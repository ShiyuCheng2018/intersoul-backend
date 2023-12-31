import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {locations, preferences, profileMedias, users} from '../models/init-models';
import {verifications} from "../models/verifications";
import {oauth} from "../models/oauth";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import {sendResponse} from "../helper/sendResponse";
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

passport.use('local-signup', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    async (req, email, password, done) => {
        try {
            const existingUser = await users.findOne({ where: { email } });
            if (existingUser) {
                return done(null, false, { message: 'Seems you already have an account. Please try to login.' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = await users.create({
                email,
                hashed_password: hashedPassword,
                gender_id: req.body.genderId,
                user_name: req.body.userName,
                date_of_birth: req.body.dateOfBirth,
                profile_description: req.body.profileDescription,
                is_profile_complete: false,
                provider: "local",
                provider_id: "",
            });

            // If the user is authenticated successfully:
            const payload = {
                userId: newUser.user_id,
                email: newUser.email
            };

            // Generate access token
            const accessToken = jwt.sign(payload, JWT_SECRET, {
                expiresIn: '15m'
            });

            // Generate refresh token
            const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
                expiresIn: '7d'
            });

            // Save refresh token to the database
            await oauth.create({
                user_id: newUser.user_id,
                access_token: accessToken,
                refresh_token: refreshToken,
                expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            return done(null, { newUser, accessToken});
        } catch (error) {
            return done(error);
        }
    }
));

// Local Strategy
passport.use("local-login", new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        try {
            const _user = await users.findOne({ where: { email: email}, attributes: { exclude: ['createdAt', 'updatedAt'] }});

            if (!_user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            if(_user.hashed_password){
                if (!await bcrypt.compare(password, _user.hashed_password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            }else {
                return done(null, false, { message: 'You might have an account with a social login.' });
            }


            const { hashed_password , ...user } = _user.get();

            // If the user is authenticated successfully:
            const payload = {
                userId: user.user_id,
                email: user.email
            };

            // Generate access token
            const accessToken = jwt.sign(payload, JWT_SECRET, {
                expiresIn: '15m'
            });

            // Generate refresh token
            const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
                expiresIn: '7d'
            });

            // Save refresh token to the database
            let userOAuth = await oauth.findOne({ where: { user_id: user.user_id }});

            if (userOAuth) {
                await userOAuth.update({
                    user_id: user.user_id,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                });
            }else  return done(null, false, { message: 'something wrong with your account, please contact us immediately.' });

            let _profileMedias: Array<profileMedias> = [];
            let location: locations | null = null;

            _profileMedias = await profileMedias.findAll({where: {user_id: user.user_id}, attributes: { exclude: ['createdAt', 'updatedAt', 'upload_date'] }})
            location = await locations.findOne({where: {user_id: user.user_id}, attributes: { exclude: ['createdAt', 'updatedAt'] }}) as locations;

            // Find the user's preference record
            const preference = await preferences.findOne({ where: { user_id: user.user_id },  attributes: { exclude: ['createdAt', 'updatedAt'] }});
            // If no preference record is found for the user send an error response)
            if (!preference) {
                return done(null, false, { message: 'No preferences found' });
            }

            return done(null, { user:{...user, profileMedias: _profileMedias, location, preferences:preference}, accessToken});
        } catch (err) {
            return done(err);
        }
    }
));

//Google Strategy Here.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://yourdomain.com/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
    // Find or Create a user based on the Google profile data
    let user = await users.findOne({ where: { provider: 'Google', provider_id: profile.id } });
    if (!user) {
        if (!profile.emails || !profile.emails[0]) {
            return done(null, false, { message: 'Emails not provided by Google.' });
        }
        const email = profile.emails[0].value;
        const isEmailVerified = profile.emails[0].verified;
        try {
            // Create a user
            const user = await users.create({
                provider: 'Google',
                provider_id: profile.id,
                email,
                is_profile_complete: false,
            });

            // If the user was created successfully, create their verification record
            if (user) {
                // @ts-ignore
                await verifications.create({
                    user_id: user.user_id,
                    email_verification_status: isEmailVerified ? "Verified" : "Not Verified",
                    phone_verification_status: "Not Verified",
                    profile_medias_verification_status: "Not Verified",
                });
            }
            return done(null, user);
        } catch (error) {
            console.error("Error creating user or verifications:", error);
        }
    }else {
        return done(null, user);
    }
}));


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    passReqToCallback: true
};



passport.use("jwt",new JwtStrategy(opts, async (req:any, jwt_payload:any, done:any) => {
    try {
        const user = await users.findOne({ where: { user_id: jwt_payload.userId } });
        if (!user) {
            return done(null, false, "User not found");
        }

        // If token is valid, pass the user to the next middleware
        return done(null, {email:user.email, userId: user.user_id});
    } catch (err:any) {
        console.log(err)
        return done(err, false);
    }
}));

// Serialize and Deserialize User
passport.serializeUser((user: any, done) => {
    done(null, user.userId);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await users.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
