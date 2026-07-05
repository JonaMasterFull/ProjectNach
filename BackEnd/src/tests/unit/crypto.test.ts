import { encryptConsecutive } from "../../utils/crypto";

describe("encryptConsecutive", () => {
  it("devuelve formato iv:tag:encrypted", () => {
    const result = encryptConsecutive(42);
    const parts = result.split(":");

    expect(parts).toHaveLength(3);
    expect(parts[0]).toHaveLength(32);
    expect(parts[1]).toHaveLength(32);
    expect(parts[2]?.length).toBeGreaterThan(0);
  });

  it("genera valores distintos para el mismo número (IV aleatorio)", () => {
    const a = encryptConsecutive(1);
    const b = encryptConsecutive(1);

    expect(a).not.toBe(b);
  });

  it("lanza error si APP_SECRET y SALT no están definidos", () => {
    jest.isolateModules(() => {
      jest.doMock("../../config/environment", () => ({
        environment: {
          APP_SECRET: "",
          SALT: "",
        },
      }));

      const { encryptConsecutive: encryptWithoutSecrets } =
        require("../../utils/crypto") as typeof import("../../utils/crypto");

      expect(() => encryptWithoutSecrets(1)).toThrow(
        "APP_SECRET y SALT deben estar definidos en .env",
      );
    });
  });
});
