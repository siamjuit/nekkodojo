import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyJWT(role: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");
    if (!token) return false;
    const decoded = verify(token.value, process.env.JWT_SECRET!) as JwtPayload;
    if (decoded.role !== role && decoded.role !== "admin") {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
