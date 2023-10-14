import {Router} from "express";
import {handleSwipe} from "../controllers/interactionControllers";

const router = Router();

router.post("/swipe", handleSwipe);

export default router;