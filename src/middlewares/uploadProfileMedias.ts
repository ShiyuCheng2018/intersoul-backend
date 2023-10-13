import multer from 'multer';
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from 'multer-s3';

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRETACCESS_KEY as string,
    },
});


const uploadMedia = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET as string,
        key: (req:any, file, cb) => {
            console.log(req.user)
            const filename = `profiles/${req.user.userId}/${Date.now()}-${file.originalname}`;
            cb(null, filename);
        }
    })
}).single('media');

export default uploadMedia;

