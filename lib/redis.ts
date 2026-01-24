import { Redis } from "@upstash/redis";

const getRedisClient = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Redis credentials are missing from .env.local");
  }
  return Redis.fromEnv();
};

export const redis = getRedisClient();
