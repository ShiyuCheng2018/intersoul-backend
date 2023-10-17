import app from './app';
import sequelize from './config/database';
import dotenv from 'dotenv';
import { createServer } from 'http';
import {setupSocketIO} from "./socket/socketSetup";
import {socketHandler} from "./socket/socketHandler";

dotenv.config();
const PORT = process.env.PORT;

const httpServer = createServer(app);
const io = setupSocketIO(httpServer);

io.on('connection', (socket)=>socketHandler(socket, io));

// Test database connection and start the server
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.\n');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
