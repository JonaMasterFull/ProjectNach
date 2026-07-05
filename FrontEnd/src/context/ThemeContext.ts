import { createContext } from "react";
import type { StoreType, ThemeConfig } from "../config/types/theme.types";

interface ThemeContextValue {
  theme: ThemeConfig;
  storeType: StoreType;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
