import redis from "../db/redis.js";

const rooms = new Map();

const joinRoom = (roomId, ws, userId) => {
    if(rooms.has(roomId)){
        rooms.get(roomId).add(ws);
    } else{
        rooms.set(roomId, new Set([ws]));
    }

    redis.sadd(`room:${roomId}`, userId);
}

const leaveRoom = (roomId, ws, userId) => {
    rooms.get(roomId).delete(ws);
    redis.srem(`room:${roomId}`, userId);
}

const broadcastToRoom = (roomId, message, senderWs) => {
    const clients = rooms.get(roomId);

    for(const client of clients){
        if(client !== senderWs){
            client.send(message)
        }
    }
}

export { joinRoom, leaveRoom, broadcastToRoom }