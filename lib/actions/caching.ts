import { redis } from "../redis";

interface iProps {
  key: string;
  fetcher: () => any;
  expires: number;
}

export const fetchItems = async ({ key, fetcher, expires }: iProps) => {
  const item = await get(key);
  if (item) return item;
  return set({ key, fetcher, expires });
};

export const get = async (key: string) => {
  const value = await redis.get(key);
  if (!value) return null;
  return JSON.parse(value);
};

export const set = async ({ key, fetcher, expires }: iProps) => {
  const value = await fetcher();
  await redis.set(key, JSON.stringify(value), "EX", expires);
  return value;
};
