import { useCallback } from "react";
import { formatCharacterCounter, useTheme } from "../../../hooks/useTheme";
import { getInputFieldClasses, themeClasses } from "../../../lib/themeClasses";
import { useSpeechDictation } from "../../../hooks/useSpeechDictation";
import { useTextInput } from "../../hooks/useTextInput";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput = ({ value, onChange }: TextInputProps) => {
  const { theme } = useTheme();
  const {
    namePlaceholder,
    nameMaxLength,
    characterCounterTemplate,
    voiceInputStart,
    voiceInputStop,
  } = theme.texts;
  const { isEmpty, isTouched, handleChange, handleFocus, handleBlur } =
    useTextInput(value, onChange);

  const handleTranscript = useCallback(
    (text: string) => {
      onChange(text);
      handleFocus();
    },
    [onChange, handleFocus],
  );

  const { isSupported, isListening, error, toggleListening } =
    useSpeechDictation({
      maxLength: nameMaxLength,
      onTranscript: handleTranscript,
    });

  const inputClasses = [
    getInputFieldClasses(isEmpty, isTouched),
    isSupported ? themeClasses.inputFieldWithVoiceButton : "",
  ].join(" ");

  return (
    <div className={themeClasses.inputWrapper}>
      <div className={themeClasses.inputWithVoice}>
        <input
          className={inputClasses}
          type="text"
          value={value}
          maxLength={nameMaxLength}
          placeholder={namePlaceholder}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {isSupported ? (
          <button
            type="button"
            aria-label={isListening ? voiceInputStop : voiceInputStart}
            aria-pressed={isListening}
            onClick={toggleListening}
            className={[
              themeClasses.voiceButton,
              isListening ? themeClasses.voiceButtonActive : "",
            ].join(" ")}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5 fill-current"
            >
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z" />
            </svg>
          </button>
        ) : null}
      </div>

      {error ? <span className={themeClasses.voiceError}>{error}</span> : null}

      <span className={themeClasses.inputCounter}>
        {formatCharacterCounter(
          characterCounterTemplate,
          value.length,
          nameMaxLength,
        )}
      </span>
    </div>
  );
};
