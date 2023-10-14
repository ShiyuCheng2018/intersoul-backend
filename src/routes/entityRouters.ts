import {Router} from "express";
import {getEntities} from "../controllers/entityController";


const router = Router();

router.get("/", getEntities);


export default router;