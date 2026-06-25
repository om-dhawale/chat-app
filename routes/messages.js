import {Router} from 'express';
import { getMessages } from '../controllers/messageController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = Router();



router.get('/:roomId', authMiddleware, async (req, res, next) => {
    try {
        const roomId = parseInt(req.params.roomId);
        const messages = await getMessages(roomId);
        res.status(200).json({messages: messages });
    } catch (error) {
        next(error);
    }
    
});

export default router;