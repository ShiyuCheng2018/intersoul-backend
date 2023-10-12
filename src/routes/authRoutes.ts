import { Router } from 'express';
import * as userControllers from '../controllers/authControllers';
import {checkProfileCompletion} from "../middlewares/checkProfileCompletion";

const router = Router();
router.post('/signup', userControllers.signup, checkProfileCompletion,  (req, res) => {
    res.json({
        success: true,
        user: {...req.user, is_profile_complete: req.body.isProfileComplete},
    });
});
router.post('/login', userControllers.login, checkProfileCompletion,  (req, res) => {
    res.json({
        success: true,
        user: {...req.user, is_profile_complete: req.body.isProfileComplete},
    });
});

export default router;