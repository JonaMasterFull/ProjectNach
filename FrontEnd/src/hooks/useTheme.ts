import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }

  return context;
};

export const formatCharacterCounter = (
  template: string,
  current: number,
  max: number,
): string => {
  return template
    .replace("{current}", String(current))
    .replace("{max}", String(max));
};
