import { useLayoutEffect, useMemo, type ReactNode } from "react";
import { getTheme } from "../config/getTheme";
import type { StoreType } from "../config/types/theme.types";
import { ThemeContext } from "./ThemeContext";

interface ThemeProviderProps {
  children: ReactNode;
  storeType: StoreType;
}

const applyThemeVariables = (theme: ReturnType<typeof getTheme>): void => {
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-color-${key}`, value);
  });

  Object.entries(theme.styles).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
};

export const ThemeProvider = ({ children, storeType }: ThemeProviderProps) => {
  const theme = useMemo(() => getTheme(storeType), [storeType]);

  useLayoutEffect(() => {
    applyThemeVariables(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      storeType: theme.id,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
