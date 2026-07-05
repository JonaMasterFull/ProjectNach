import type { ButtonHTMLAttributes, ReactNode } from "react";
import { themeClasses } from "../../../lib/themeClasses";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const PrimaryButton = ({
  children,
  disabled,
  className = "",
  ...props
}: PrimaryButtonProps) => {
  return (
    <button
      className={`${themeClasses.button} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
