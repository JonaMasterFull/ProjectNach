import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetAesKeyCache } from "../../lib/crypto/key";
import { decryptConsecutive, encryptName } from "../../utils/crypto";

describe("crypto", () => {
  beforeEach(() => {
    resetAesKeyCache();
    vi.stubEnv("VITE_APP_SECRET", "test-secret-32-chars-minimum!!");
    vi.stubEnv("VITE_SALT", "test-salt");
  });

  it("encripta y desencripta el nombre correctamente", async () => {
    const encrypted = await encryptName("María");
    const decrypted = await decryptConsecutive(encrypted);

    expect(decrypted).toBe("María");
  });

  it("genera payloads distintos para el mismo valor", async () => {
    const first = await encryptName("Ana");
    const second = await encryptName("Ana");

    expect(first).not.toBe(second);
  });

  it("lanza error si faltan credenciales en .env", async () => {
    resetAesKeyCache();
    vi.stubEnv("VITE_APP_SECRET", "");
    vi.stubEnv("VITE_SALT", "");

    await expect(encryptName("Juan")).rejects.toThrow(
      "VITE_APP_SECRET y VITE_SALT deben estar definidos en .env",
    );
  });

  it("lanza error con formato inválido al desencriptar", async () => {
    await expect(decryptConsecutive("formato-invalido")).rejects.toThrow(
      "Formato de dato encriptado inválido",
    );
  });
});
