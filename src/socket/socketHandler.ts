import {Server, Socket} from 'socket.io';
import chatEvents  from './events/chatEvents';

export interface InterSoulSocket extends Socket {
    chatRoom?: string; // or any other properties you'd like to add
}

export const socketHandler = (socket: InterSoulSocket, io: Server) => {
    chatEvents(socket, io);
    // ... any other event groups
};
