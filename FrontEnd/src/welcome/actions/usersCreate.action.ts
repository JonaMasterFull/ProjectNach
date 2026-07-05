import type { StoreType } from "../../config/types/theme.types";
import { encryptName } from "../../utils/crypto";
import { usersApi } from "../api/users.api";
import type {
  UsersCreateRequest,
  UsersCreateResponse,
} from "../interface/users.interface";

export const usersCreate = async (
  name: string,
  storeType: StoreType,
): Promise<UsersCreateResponse> => {
  const encryptedName = await encryptName(name);
  const payload: UsersCreateRequest = { encryptedName, storeType };
  const { data } = await usersApi.post<UsersCreateResponse>("/users", payload);

  return data;
};
