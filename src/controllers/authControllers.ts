import passport from 'passport';

export const login = (req: any, res: any, next: any) => {
    passport.authenticate('local-login', (err: any, authObject: any, info: any) => {
        if (err) {
            return next(err);  // Error during authentication
        }
        if (!authObject) {
            // Authentication failed
            return res.status(401).json({ success: false, message: info.message });
        }

        const { user, accessToken } = authObject;

        // Authentication succeeded
        return res.json({ success: true, user, accessToken });
    })(req, res, next);
};

export const signup =(req:any, res:any, next:any) => {
    passport.authenticate('local-signup', (err:any, authObject:any, info:any) => {
        if (err) {
            return next(err);
        }
        if (!authObject) {
            return res.status(400).json({ success: false, message: info.message });
        }

        const { newUser, accessToken } = authObject;

        // Optionally log the user in or send a success message
        return res.status(201).json({ success: true, user:newUser, accessToken});
    })(req, res, next);
};

