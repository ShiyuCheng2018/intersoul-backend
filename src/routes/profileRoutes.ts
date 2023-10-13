import {Router} from "express";
import {putProfileDetails, postProfileMedia} from "../controllers/profileControllers";
import uploadMedia from "../middlewares/uploadProfileMedias";

const router = Router();

router.post("/medias",uploadMedia, postProfileMedia);
router.put("/details", putProfileDetails);


export default router;