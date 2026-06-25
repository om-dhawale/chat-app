console.log('ENV CHECK:', process.env.REDIS_PUBLIC_URL, process.env.JWT_SECRET);
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config({ override: false });
const redis = new Redis(process.env.REDIS_PUBLIC_URL);
export default redis;