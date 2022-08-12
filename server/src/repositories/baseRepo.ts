import jwt from "jsonwebtoken";

export default class BaseRepo {
  decodeAuthToken(token: string): number {
    let secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing");
    if (!token) throw new Error("Missing auth token");
    let result = jwt.verify(token, secret);

    return (result as { id: number }).id as number;
  }
}
