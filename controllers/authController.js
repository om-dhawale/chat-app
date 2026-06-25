import pool from '../db/pool.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {registerSchema, loginSchema} from '../schemas/userSchema.js';
// import 'dotenv/config';
import AppError from '../errors/AppError.js';


const authController = {
    register : async (req, res, next) => {

        try {

            const validation = registerSchema.safeParse(req.body);
            
            if(!validation.success){
                return res.status(400).json({error : JSON.parse(validation.error.message)});
            } 
            const { username, email, password } = validation.data;
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query('INSERT INTO users(username, email, password) VALUES($1, $2, $3)', [username, email, hashedPassword]);
            res.status(201).json({message : `user ${username} registered successfully`});
        } catch (error) {
            if(error.code === '23505'){
                next( new AppError('Email already exists', 409) );
            }
            next(error)
        }  
    },

    login : async (req, res, next) => {
        try {
            const validation = loginSchema.safeParse(req.body);

            if(!validation.success){
                return res.status(400).json({error : validation.error.message});
            }
            const {email, password} = validation.data;
            const user = await pool.query('SELECT id,username,password from users WHERE email=$1', [email]);
            if(user.rows.length === 0){
                throw new AppError("user not found", 404);
            }
            const match = await bcrypt.compare(password, user.rows[0].password);
            if(!match){
                throw new AppError('Wrong Credentials', 400);
            }
            const payload = {userId : user.rows[0].id, username : user.rows[0].username};
            const secretKey = process.env.JWT_SECRET;
            const options = {expiresIn: '2h'};

            const token = jwt.sign(payload, secretKey, options);

            res.status(200).json({token : token, username : user.rows[0].username});

        } catch (error) {
            next(error)
        }
    }
}

export default authController;