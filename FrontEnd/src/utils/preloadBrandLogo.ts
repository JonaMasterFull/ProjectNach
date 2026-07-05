let preloadedLogoHref: string | null = null;

export const preloadBrandLogo = (href: string): void => {
  if (typeof document === "undefined" || preloadedLogoHref === href) return;

  document
    .querySelector('link[data-preload="brand-logo"]')
    ?.remove();

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = href;
  link.dataset.preload = "brand-logo";
  document.head.appendChild(link);

  preloadedLogoHref = href;
}
