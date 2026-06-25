import express from "express";
import authRouter from './routes/auth.js';
import roomRouter from './routes/rooms.js'
import messageRouter from './routes/messages.js';
import morgan from "morgan";
import AppError from './errors/AppError.js';

const app = express();


app.use(express.json());

app.use(morgan('dev'));

app.use(express.static('public'));

app.use('/auth', authRouter);
app.use('/room', roomRouter);
app.use('/messages', messageRouter);


app.use((req, res) => {
    res.status(404).json({error : "route not found"})
});

app.use((err, req, res, next) => {
    console.error(err);
    if( err instanceof AppError){
        return res.status(err.statuscode).json({error : err.message})
    }

    res.status(500).json({error : "something went wrong"})
})

export default app;