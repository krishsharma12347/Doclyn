const redis = require('redis');

let redisClient;

const connectRedis = async () => {
  try {
    if (redisClient?.isOpen) {
      return redisClient;
    }

    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    await redisClient.connect();

    console.log('Redis Connected');

    return redisClient;
  } catch (error) {
    console.error(`Redis connection error: ${error.message}`);
    throw error;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }

  return redisClient;
};

module.exports = {
  connectRedis,
  getRedisClient,
};