import { redis } from "../redis";

interface iProps<T> {
  key: string;
  fetcher: () => T | Promise<T>;
  expires: number;
}

export const fetchItems = async <T>({ key, fetcher, expires }: iProps<T>) => {
  const item = await get(key);
  if (item) return item as T;
  return set({ key, fetcher, expires });
};

export const get = async (key: string) => {
  const value = await redis.get(key);
  if (!value) return null;
  return value;
};

export const set = async <T>({ key, fetcher, expires }: iProps<T>) => {
  const value = await fetcher();
  await redis.set(key, value, { ex: expires });
  return value;
};

export const deleteCacheKeys = async (...keys: string[]) => {
  const uniqueKeys = [...new Set(keys.filter(Boolean))];
  if (uniqueKeys.length === 0) return 0;

  return redis.del(...uniqueKeys);
};

export const deleteCacheByPrefix = async (prefix: string) => {
  let cursor: string | number = 0;
  let deleted = 0;

  do {
    const scanResult: [string | number, string[]] = await redis.scan(cursor, {
      match: `${prefix}*`,
      count: 100,
    });
    const nextCursor: string | number = scanResult[0];
    const keys: string[] = scanResult[1];

    if (keys.length > 0) {
      deleted += await redis.del(...keys);
    }

    cursor = nextCursor;
  } while (cursor !== 0 && cursor !== "0");

  return deleted;
};

export const invalidateDiscussionCaches = async (discussionId: string, userId?: string) => {
  try {
    await Promise.all([
      deleteCacheByPrefix(`discussion:${discussionId}:`),
      deleteCacheByPrefix("discussions:"),
      deleteCacheByPrefix("leaderboard:"),
      userId ? deleteCacheKeys(`discussion:${discussionId}:u:${userId}`) : Promise.resolve(0),
    ]);
  } catch (error) {
    console.error("Discussion cache invalidation failed:", error);
  }
};

export const invalidateCommentCaches = async (discussionId: string) => {
  try {
    await Promise.all([
      deleteCacheByPrefix(`comments:d=${discussionId}:`),
      invalidateDiscussionCaches(discussionId),
    ]);
  } catch (error) {
    console.error("Comment cache invalidation failed:", error);
  }
};
