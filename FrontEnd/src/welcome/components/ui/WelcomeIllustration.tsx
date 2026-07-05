import { useTheme } from "../../../hooks/useTheme";
import { themeClasses } from "../../../lib/themeClasses";
import { LazyImage } from "./LazyImage";

export const WelcomeIllustration = () => {
  const { theme } = useTheme();

  return (
    <LazyImage
      className={themeClasses.illustration}
      src={theme.assets.illustration}
      alt=""
      aria-hidden="true"
    />
  );
};
