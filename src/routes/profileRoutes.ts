import {Router} from "express";
import {putProfileDetails, postProfileMedias} from "../controllers/profileControllers";

const router = Router();


// router.post("/profile/medias", postProfileMedias);

 router.put("/details", putProfileDetails);



export default router;