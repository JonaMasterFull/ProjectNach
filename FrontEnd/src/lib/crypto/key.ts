import { scrypt } from "@noble/hashes/scrypt.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";
import { AES_GCM } from "./constants";
import { getEnvCredentials } from "./credentials";

let cachedKey: Promise<CryptoKey> | null = null;

const deriveKeyBytes = (): Uint8Array => {
  const { secret, salt } = getEnvCredentials();

  return scrypt(utf8ToBytes(secret), utf8ToBytes(salt), {
    N: 16384,
    r: 8,
    p: 1,
    dkLen: 32,
  });
};

export const getAesKey = (): Promise<CryptoKey> => {
  if (!cachedKey) {
    cachedKey = crypto.subtle.importKey(
      "raw",
      new Uint8Array(deriveKeyBytes()),
      { name: AES_GCM },
      false,
      ["encrypt", "decrypt"],
    );
  }

  return cachedKey;
};

/** Invalida la clave en memoria (útil en tests cuando cambian las variables de entorno). */
export const resetAesKeyCache = (): void => {
  cachedKey = null;
};
