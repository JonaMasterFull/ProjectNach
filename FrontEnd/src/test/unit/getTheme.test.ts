import { describe, expect, it } from "vitest";
import { getTheme } from "../../config/getTheme";

describe("getTheme", () => {
  it("devuelve tema Elektra con assets y textos de marca", () => {
    const theme = getTheme("Elektra");

    expect(theme.id).toBe("Elektra");
    expect(theme.texts.startButton).toBe("Comenzar");
    expect(theme.assets.logo).toBeTruthy();
  });

  it("devuelve tema ShopingBaz con identidad distinta", () => {
    const theme = getTheme("ShopingBaz");

    expect(theme.id).toBe("ShopingBaz");
    expect(theme.texts.welcomeTitleLine2).toBeTruthy();
    expect(theme.assets.logo).toBeTruthy();
  });
});
