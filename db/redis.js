import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_PUBLIC_URL || 'redis://localhost:6379');
export default redis;