import { ThemeProvider } from "../context/ThemeProvider";
import { WelcomeScreen } from "../welcome/components/WelcomeScreen";
import { useIntroPage } from "./hooks/useIntroPage";

export const IntroPage = () => {
  const { isSubmitting, hasSubmitError, handleSubmit, storeType } = useIntroPage();

  return (
    <ThemeProvider storeType={storeType}>
      <WelcomeScreen
        isSubmitting={isSubmitting}
        hasSubmitError={hasSubmitError}
        onSubmit={handleSubmit}
      />
    </ThemeProvider>
  );
};
