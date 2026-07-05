import type { ImgHTMLAttributes } from "react";

type LazyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> & {
  alt: string;
};

export const LazyImage = ({ className = "", alt, ...props }: LazyImageProps) => {
  return (
    <img
      {...props}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
};
