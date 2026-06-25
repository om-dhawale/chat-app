import { Router } from "express";
import { getAllRooms, createRoom, deleteRoom } from "../controllers/roomController.js";
import authMiddleware from '../middlewares/authMiddleware.js'

const router = Router();



router.get('/', getAllRooms);
router.post('/', authMiddleware, createRoom);
router.delete('/:id', authMiddleware, deleteRoom);

export default router;