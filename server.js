import app from "./app.js";
import dotenv from 'dotenv';
import http from 'http';
import initWebSocketServer from "./socket/websocketServer.js";
import './jobs/emailWorker.js';

dotenv.config({ override: false });

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server is running...`));

initWebSocketServer(server);