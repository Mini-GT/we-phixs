import jwt from "jsonwebtoken";

export function verifyJwt(token: string, secretKey: string) {
  return jwt.verify(token, secretKey);
}
