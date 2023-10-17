import multer from 'multer';
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from 'multer-s3';
import { logHelper } from "../helper/functionLoggerHelper";

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRETACCESS_KEY as string,
    },
});

export const generateUploadMiddleware = (type: "profile" | "chat") => {
    return multer({
        storage: multerS3({
            s3: s3Client,
            bucket: process.env.AWS_BUCKET as string,
            key: (req: any, file, cb) => {
                logHelper({ level: "INFO", message: `Uploading ${type} media`, functionName: "uploadMedia", additionalData: JSON.stringify(req.user) });

                let filename = "";

                switch (type) {
                    case "profile":
                        filename = `profiles/${req.user.userId}/${Date.now()}-${file.originalname}`;
                        break;
                    case "chat":
                        const chatRoomId = req.params.chatRoomId; // Assuming chat room ID is a parameter in the route
                        filename = `chat/${chatRoomId}/${Date.now()}-${req.user.userId}`;
                        break;
                    default:
                        break;
                }

                cb(null, filename);
            }
        })
    }).single('media');
}
