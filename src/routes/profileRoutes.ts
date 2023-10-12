import {Router} from "express";
import {putProfileDetails, postProfileMedias} from "../controllers/profileControllers";
import {jwtMiddleware} from "../middlewares/jwtMiddleware";

const router = Router();


// router.post("/profile/medias", postProfileMedias);

 router.put("/details", jwtMiddleware, putProfileDetails);



export default router;