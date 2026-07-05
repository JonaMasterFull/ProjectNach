import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { themeAssets } from "../../config/themeAssets";
import { preloadBrandLogo } from "../../utils/preloadBrandLogo";
import { usersCreate } from "../../welcome/actions/usersCreate.action";
import { getStoreTypeFromIp } from "../../config/storeRoutes";
import type { StoreType } from "../../config/types/theme.types";

export const useIntroPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitError, setHasSubmitError] = useState(false);
  
    const storeType = useMemo(
      () => getStoreTypeFromIp(searchParams.get("iP")),
      [searchParams],
    );
  
    useEffect(() => {
      preloadBrandLogo(themeAssets[storeType].logo);
    }, [storeType]);
  
    const handleSubmit = async (name: string, submittedStoreType: string) => {
      setIsSubmitting(true);
      setHasSubmitError(false);
  
      try {
        const response = await usersCreate(name, submittedStoreType as StoreType);
  
        navigate(`/pages/result?iP=${searchParams.get("iP") ?? "1"}`, {
          state: {
            name,
            numeroEncriptado: response.numeroEncriptado,
          },
        });
      } catch {
        setHasSubmitError(true);
      }
  
      setIsSubmitting(false);
    };
  
    return {
        isSubmitting,
        hasSubmitError,
        handleSubmit,
        storeType,
  }
}
