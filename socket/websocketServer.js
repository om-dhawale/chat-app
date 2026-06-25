import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { joinRoom, leaveRoom, broadcastToRoom } from "./room.js";
import {saveMessage, getMessages} from "../controllers/messageController.js";
import emailQueue from "../jobs/emailQueue.js";

dotenv.config({ override: false });

const initWebSocketServer = (server) => {
    const wss = new WebSocketServer({server});

    wss.on('connection', (ws, req) => {
        let userId;
        let username;
        let roomId;
        try {
            const params = new URL(req.url, 'ws://localhost:8080').searchParams;
            const token  = params.get('token');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
            username = decoded.username;
            console.log(`user ${userId} connected`)
        } catch (error) {
            ws.close();
        }

        if(!userId) return;
        
        ws.on('message', (data) => {
            const text = JSON.parse(data);
            if(text.type === 'join_room'){
                joinRoom(text.roomId, ws, userId);
                roomId = text.roomId;
            } else if(text.type === 'message'){
                broadcastToRoom(text.roomId, JSON.stringify({ body: text.body, username: username }), ws);
                saveMessage(userId, roomId, text.body);
                emailQueue.add('sendEmail', { roomId, senderUserId: userId, message: text.body });
            }
        });

        ws.on('close', () => {
            leaveRoom(roomId, ws, userId)
        });
    });
};

export default initWebSocketServer;

