import type { StoreType } from "../config/types/theme.types";
import { ThemeProvider } from "../context/ThemeProvider";
import { ResultScreen } from "../welcome/components/ResultScreen";
import type { UserResultState } from "../welcome/interface/users.interface";
import { useResultPage } from "./hooks/useResultPage";

export const ResultPage = () => {
  const { storeType, state } = useResultPage() as { storeType: StoreType; state: UserResultState };

  return (
    <ThemeProvider storeType={storeType}>
      <ResultScreen name={state.name} numeroEncriptado={state.numeroEncriptado} />
    </ThemeProvider>
  );
};
