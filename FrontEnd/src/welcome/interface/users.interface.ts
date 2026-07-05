import type { StoreType } from "../../config/types/theme.types";

export interface UsersCreateRequest {
  encryptedName: string;
  storeType: StoreType;
}

export interface UsersCreateResponse {
  numeroEncriptado: string;
  encryptedName: string;
  storeType: StoreType;
}

export interface UserResultState {
  name: string;
  numeroEncriptado: string;
}
