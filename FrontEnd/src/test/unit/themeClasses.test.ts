import { describe, expect, it } from "vitest";
import { getInputFieldClasses, themeClasses } from "../../lib/themeClasses";

describe("getInputFieldClasses", () => {
  it("usa borde default cuando el campo no ha sido tocado", () => {
    const classes = getInputFieldClasses(true, false);

    expect(classes).toContain(themeClasses.inputFieldBase);
    expect(classes).toContain(themeClasses.inputFieldDefault);
  });

  it("usa borde vacío cuando fue tocado y está vacío", () => {
    const classes = getInputFieldClasses(true, true);

    expect(classes).toContain(themeClasses.inputFieldEmpty);
  });

  it("usa borde lleno cuando fue tocado y tiene valor", () => {
    const classes = getInputFieldClasses(false, true);

    expect(classes).toContain(themeClasses.inputFieldFilled);
  });
});
