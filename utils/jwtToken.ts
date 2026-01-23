import jwt from "jsonwebtoken";

declare interface Payload {
  userId: string;
  role: string;
}

const secret = process.env.JWT_SECRET!;

export const createJWTToken = (payload: Payload) => {
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};
