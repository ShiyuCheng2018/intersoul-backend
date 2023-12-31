import express, { Request, Response } from 'express';
import passport from 'passport';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';
import "./config/passportConfig";
import dotenv from 'dotenv';
import profileRoutes from "./routes/profileRoutes";
import {jwtMiddleware, refreshMiddleware} from "./middlewares/jwtMiddleware";
import morgan from 'morgan';
import {sendResponse} from "./helper/sendResponse";
import entityRouters from "./routes/entityRouters";
import interactionRoutes from "./routes/interactionRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());


morgan.token('emoji', (req, res) => {
    switch (req.method) {
        case 'GET':
            return '📄';
        case 'POST':
            return '✉️';
        case 'PUT':
            return '🔄';
        case 'DELETE':
            return '❌';
        default:
            return '🔍';
    }
});

const formatWithEmoji = ':emoji :remote-addr - :remote-user [:date[clf]] ' +
    ':method :url :status :response-time ms - :res[content-length]\n' +
    '=================================================================================================================='
;

app.use(morgan(formatWithEmoji));

// Your routes go here
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to InterSoul!');
});


app.use('/auth', authRoutes);
app.use("/profile", jwtMiddleware,refreshMiddleware, profileRoutes);
app.use("/entities", jwtMiddleware,refreshMiddleware, entityRouters);
app.use("/interaction", jwtMiddleware,refreshMiddleware, interactionRoutes);
app.use('/api', jwtMiddleware,refreshMiddleware, chatRoutes);

// Error handler
app.use((err:any, req:any, res:any, next:any) => {
    console.error(err.stack);
    return sendResponse(res, 500, false, "Something went wrong.", null, err.message);
});


export default app;