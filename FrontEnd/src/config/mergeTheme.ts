import type {
  StoreType,
  ThemeColors,
  ThemeConfig,
  ThemeStyles,
  ThemeTexts,
} from "./types/theme.types";

export interface SharedTheme {
  texts: Omit<ThemeTexts, "welcomeTitleLine2">;
  colors: Omit<ThemeColors, "title" | "subtitle">;
  styles: Omit<ThemeStyles, "logoMaxWidth">;
}

export interface BrandThemeOverride {
  id: StoreType;
  texts: Pick<ThemeTexts, "welcomeTitleLine2">;
  colors: Pick<ThemeColors, "title" | "subtitle">;
  styles: Pick<ThemeStyles, "logoMaxWidth">;
}

export const mergeTheme = (
  shared: SharedTheme,
  brand: BrandThemeOverride,
): Omit<ThemeConfig, "assets"> => {
  return {
    id: brand.id,
    texts: { ...shared.texts, ...brand.texts },
    colors: { ...shared.colors, ...brand.colors },
    styles: { ...shared.styles, ...brand.styles },
  };
}
