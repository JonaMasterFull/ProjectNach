import crypto from "crypto";
import { environment } from "../config/environment";

const ALGORITHM = "aes-256-gcm";

const getKey = (): Buffer => {
  if (!environment.APP_SECRET || !environment.SALT) {
    throw new Error("APP_SECRET y SALT deben estar definidos en .env");
  }
  return crypto.scryptSync(environment.APP_SECRET, environment.SALT, 32);
}

/** Solo para encriptar el consecutivo en la respuesta API. El frontend lo desencripta. */
export const encryptConsecutive = (consecutiveNumber: number): string => {
  const iv = crypto.randomBytes(16);
  const text = String(consecutiveNumber);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${encrypted}`;
}
