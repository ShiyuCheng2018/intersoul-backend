import {Router} from "express";
import {
    putProfileDetails,
    postProfileMedia,
    deleteProfileMedia,
    postProfileLocation, putPreferences, fetchProfiles, getPreferences
} from "../controllers/profileControllers";
import {generateUploadMiddleware} from "../middlewares/uploadProfileMedias";

const router = Router();

router.post("/medias",generateUploadMiddleware("profile"), postProfileMedia);
router.delete("/medias/:mediaId",deleteProfileMedia);
router.put("/details", putProfileDetails);
router.post("/location", postProfileLocation);
router.put("/preferences", putPreferences);
router.get("/preferences", getPreferences);
router.get("/profiles", fetchProfiles)


export default router;
