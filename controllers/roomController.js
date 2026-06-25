import pool from "../db/pool.js";
import AppError from "../errors/AppError.js";
import redis from "../db/redis.js";

const getAllRooms = async (req, res, next) => {
  try {
    const cached = await redis.get("rooms");
    if (cached) {
      return res.status(200).json({ rooms: JSON.parse(cached) });
    }
    const rooms = await pool.query("SELECT id, name FROM rooms");
    if (rooms.rows.length === 0) {
      throw new AppError("No rooms found", 404);
    }
    redis.set("rooms", JSON.stringify(rooms.rows), "EX", 60);
    res.status(200).json({ rooms: rooms.rows });
  } catch (error) {
    next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return next(new AppError("Room name is required", 400));
    }
    const room = await pool.query(
      "INSERT INTO rooms(name) VALUES($1) RETURNING id, name ",
      [name],
    );
    redis.del("rooms");
    res.status(201).json({ room: room.rows[0] });
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM messages WHERE room_id = $1', [id]);
    const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return next(new AppError('Room not found', 404));
    }
    redis.del('rooms');
    res.status(200).json({ message: 'Room deleted' });
  } catch (error) {
    next(error);
  }
};

export { getAllRooms, createRoom, deleteRoom };
