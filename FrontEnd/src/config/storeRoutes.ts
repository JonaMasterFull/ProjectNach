import type { StoreType } from "./types/theme.types";

/** Mapeo iP → tienda. Agrega nuevos partners aquí. */
const STORE_BY_IP: Record<string, StoreType> = {
  "1": "Elektra",
  "2": "ShopingBaz",
};

export const DEFAULT_STORE_IP = "1";

export const getStoreTypeFromIp = (ip: string | null): StoreType => {
  if (ip && ip in STORE_BY_IP) {
    return STORE_BY_IP[ip]!;
  }

  return STORE_BY_IP[DEFAULT_STORE_IP]!;
}
