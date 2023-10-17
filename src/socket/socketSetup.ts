import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export const setupSocketIO = (httpServer: Server) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    return io;
};
