import { type FormEvent, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { themeClasses } from "../../lib/themeClasses";
import { BrandLogo } from "./ui/BrandLogo";
import { Heading } from "./ui/Heading";
import { PrimaryButton } from "./ui/PrimaryButton";
import { Text } from "./ui/Text";
import { TextInput } from "./ui/TextInput";
import { WelcomeIllustration } from "./ui/WelcomeIllustration";

interface WelcomeScreenProps {
  isSubmitting?: boolean;
  hasSubmitError?: boolean;
  onSubmit?: (name: string, storeType: string) => void | Promise<void>;
}

export const WelcomeScreen = ({
  isSubmitting = false,
  hasSubmitError = false,
  onSubmit,
}: WelcomeScreenProps) => {
  const { theme, storeType } = useTheme();
  const [name, setName] = useState("");

  const isValid =
    name.trim().length > 0 && name.length <= theme.texts.nameMaxLength;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    await onSubmit?.(name.trim(), storeType);
  };

  return (
    <main className={themeClasses.page}>
      <header className={themeClasses.logoHeader}>
        <BrandLogo />
      </header>

      <div className={themeClasses.content}>
        <WelcomeIllustration />
        <Heading
          line1={theme.texts.welcomeTitleLine1}
          line2={theme.texts.welcomeTitleLine2}
        />
        <Text>{theme.texts.welcomeSubtitle}</Text>

        <form className={themeClasses.form} onSubmit={handleSubmit}>
          <Text variant="label">{theme.texts.nameQuestion}</Text>
          <TextInput value={name} onChange={setName} />
          {hasSubmitError ? (
            <p className={themeClasses.formError}>{theme.texts.submitError}</p>
          ) : null}
          <PrimaryButton
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? theme.texts.submittingButton : theme.texts.startButton}
          </PrimaryButton>
        </form>
      </div>
    </main>
  );
};
