import './env.js';
import app from "./app.js";
import http from 'http';
import initWebSocketServer from "./socket/websocketServer.js";
import './jobs/emailWorker.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server is running...`));

initWebSocketServer(server);