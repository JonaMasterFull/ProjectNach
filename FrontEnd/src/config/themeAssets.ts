import type { StoreType, ThemeAssets } from "./types/theme.types";
import elektraLogo from "../assets/brands/elektra_brand_white.svg";
import shopinbazLogo from "../assets/brands/shopinbaz_logo_white.svg";
import welcomeIllustration from "../assets/pwa_Bienvenido.gif";

export const themeAssets: Record<StoreType, ThemeAssets> = {
  Elektra: {
    logo: elektraLogo,
    illustration: welcomeIllustration,
  },
  ShopingBaz: {
    logo: shopinbazLogo,
    illustration: welcomeIllustration,
  },
};
