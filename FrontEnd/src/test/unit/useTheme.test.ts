import { describe, expect, it } from "vitest";
import { formatCharacterCounter } from "../../hooks/useTheme";

describe("formatCharacterCounter", () => {
  it("reemplaza current y max en la plantilla", () => {
    expect(formatCharacterCounter("{current}/{max} caracteres", 3, 15)).toBe(
      "3/15 caracteres",
    );
  });
});
