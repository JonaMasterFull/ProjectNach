import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DEFAULT_STORE_IP } from "../../config/storeRoutes";
import { useTheme } from "../../hooks/useTheme";
import { themeClasses } from "../../lib/themeClasses";
import { decryptConsecutive } from "../../utils/crypto";
import { BrandLogo } from "./ui/BrandLogo";
import { Heading } from "./ui/Heading";
import { PrimaryButton } from "./ui/PrimaryButton";
import { Text } from "./ui/Text";

interface ResultScreenProps {
  name: string;
  numeroEncriptado: string;
}

export const ResultScreen = ({ name, numeroEncriptado }: ResultScreenProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const [consecutiveNumber, setConsecutiveNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    decryptConsecutive(numeroEncriptado)
      .then((value) => {
        if (!cancelled) setConsecutiveNumber(value);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo obtener tu número de cliente.");
      });

    return () => {
      cancelled = true;
    };
  }, [numeroEncriptado]);

  const greeting = theme.texts.resultGreeting.replace("{name}", name);

  const handleBackToWelcome = () => {
    const storeIp = searchParams.get("iP") ?? DEFAULT_STORE_IP;
    navigate(`/pages/intro?iP=${storeIp}`, { replace: true });
  };

  return (
    <main className={`${themeClasses.page} justify-center`}>
      <div className={themeClasses.resultContent}>
        <BrandLogo />
        <Heading
          line1={theme.texts.resultTitleLine1}
          line2={theme.texts.resultTitleLine2}
        />
        <Text>{greeting}</Text>
        <p className={themeClasses.resultLabel}>{theme.texts.resultNumberLabel}</p>

        {error ? (
          <Text>{error}</Text>
        ) : consecutiveNumber === null ? (
          <Text>{theme.texts.resultLoading}</Text>
        ) : (
          <p className={themeClasses.resultNumber}>{consecutiveNumber}</p>
        )}

        <PrimaryButton type="button" onClick={handleBackToWelcome}>
          {theme.texts.resultBackButton}
        </PrimaryButton>
      </div>
    </main>
  );
};
