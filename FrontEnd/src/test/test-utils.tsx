import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "../context/ThemeProvider";
import type { StoreType } from "../config/types/theme.types";

interface RenderWithThemeOptions extends Omit<RenderOptions, "wrapper"> {
  storeType?: StoreType;
}

export const renderWithTheme = (
  ui: ReactElement,
  { storeType = "Elektra", ...options }: RenderWithThemeOptions = {},
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return <ThemeProvider storeType={storeType}>{children}</ThemeProvider>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
};
