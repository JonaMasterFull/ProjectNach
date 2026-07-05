import type { ReactNode } from "react";
import { themeClasses } from "../../../lib/themeClasses";

interface TextProps {
  children: ReactNode;
  variant?: "body" | "label";
}

export const Text = ({ children, variant = "body" }: TextProps) => {
  const className =
    variant === "label" ? themeClasses.textLabel : themeClasses.textBody;

  return <p className={className}>{children}</p>;
};
