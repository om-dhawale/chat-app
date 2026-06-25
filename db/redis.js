console.log('REDIS URL:', process.env.REDIS_PUBLIC_URL);
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_PUBLIC_URL);
export default redis;