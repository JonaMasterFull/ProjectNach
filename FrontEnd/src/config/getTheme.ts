import type { StoreType, ThemeConfig } from "./types/theme.types";
import { mergeTheme, type BrandThemeOverride, type SharedTheme } from "./mergeTheme";
import { themeAssets } from "./themeAssets";
import sharedTheme from "./themes/shared.theme.json";
import elektraTheme from "./themes/elektra.theme.json";
import shopingbazTheme from "./themes/shopingbaz.theme.json";

const brandThemes: Record<StoreType, BrandThemeOverride> = {
  Elektra: elektraTheme as BrandThemeOverride,
  ShopingBaz: shopingbazTheme as BrandThemeOverride,
};

const themes: Record<StoreType, Omit<ThemeConfig, "assets">> = {
  Elektra: mergeTheme(sharedTheme as SharedTheme, brandThemes.Elektra),
  ShopingBaz: mergeTheme(sharedTheme as SharedTheme, brandThemes.ShopingBaz),
};

export const getTheme = (storeType: StoreType): ThemeConfig => {
  return {
    ...themes[storeType],
    assets: themeAssets[storeType],
  };
}
