import { useMemo } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { DEFAULT_STORE_IP, getStoreTypeFromIp } from "../../config/storeRoutes";
import type { UserResultState } from "../../welcome/interface/users.interface";

export const useResultPage = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const storeType = useMemo(
      () => getStoreTypeFromIp(searchParams.get("iP")),
      [searchParams],
    );
  
    const state = location.state as UserResultState | null;
  
    if (!state?.name || !state.numeroEncriptado) {
      return <Navigate to={`/pages/intro?iP=${searchParams.get("iP") ?? DEFAULT_STORE_IP}`} replace />;
    }


    return {
        storeType,
        state,
  }
}
