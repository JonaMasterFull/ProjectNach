import { useTheme } from "../../../hooks/useTheme";
import { themeClasses } from "../../../lib/themeClasses";

export const BrandLogo = () => {
  const { theme } = useTheme();

  return (
    <img
      className={themeClasses.logo}
      src={theme.assets.logo}
      alt={theme.id}
      fetchPriority="high"
      decoding="sync"
      draggable={false}
    />
  );
};
