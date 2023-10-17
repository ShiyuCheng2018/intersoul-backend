import {Router} from "express";
import {generateUploadMiddleware} from "../middlewares/uploadProfileMedias";
import {sendVoiceMessage} from "../controllers/chatController";

const router = Router();

router.post('/chat/:chatRoomId/media', generateUploadMiddleware('chat'), sendVoiceMessage);


export default router;