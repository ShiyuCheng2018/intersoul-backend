import {Router} from "express";
import {
    putProfileDetails,
    postProfileMedia,
    deleteProfileMedia,
    postProfileLocation
} from "../controllers/profileControllers";
import uploadMedia from "../middlewares/uploadProfileMedias";

const router = Router();

router.post("/medias",uploadMedia, postProfileMedia);
router.delete("/medias/:mediaId",deleteProfileMedia);
router.put("/details", putProfileDetails);
router.post("/location", postProfileLocation)


export default router;