import jwt from "jsonwebtoken";

interface Payload {
  userId: string;
  username: string;
  admin: boolean;
  moderator: boolean;
}

const secret = process.env.ACCESS_TOKEN_SECRET!;

export const createJWTToken = (payload: Payload) => {
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};
