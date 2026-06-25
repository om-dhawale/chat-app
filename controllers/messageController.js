import pool from "../db/pool.js"

const saveMessage = async (userId, roomId, body) => {
    try {
        await pool.query('INSERT INTO messages(sender_id, room_id, body) VALUES($1, $2, $3)', [userId, roomId, body])
    } catch (error) {
        console.error(error)
    }
    
};

const getMessages = async (roomId) => {
    try {
        const result = await pool.query('SELECT messages.body, users.username FROM messages JOIN users ON users.id = messages.sender_id WHERE room_id = $1 ORDER BY messages.created_at ASC', [roomId]);
        return result.rows;
    } catch (error) {
        console.error(error);
    }
}
export{ saveMessage, getMessages };