/** Clases Tailwind que leen variables CSS del ThemeProvider (white-label). */
export const themeClasses = {
  page: [
    "min-h-dvh flex flex-col items-center box-border overflow-x-hidden",
    "px-[var(--theme-pagePaddingX)]",
    "pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]",
    "bg-[var(--theme-color-background)] text-[var(--theme-color-subtitle)]",
    "[font-family:var(--theme-fontFamily)]",
  ].join(" "),

  logoHeader: "w-full flex justify-center items-center shrink-0 pt-2 pb-1",
  content: [
    "w-full max-w-[var(--theme-contentMaxWidth)]",
    "flex flex-col items-center gap-4 justify-start",
    "pb-[var(--theme-pagePaddingBottom)]",
  ].join(" "),

  form: "w-full flex flex-col gap-3",

  logo: "w-full max-w-[var(--theme-logoMaxWidth)] object-contain",

  illustration: [
    "w-full max-w-[var(--theme-illustrationMaxWidth)]",
    "object-contain mt-4",
  ].join(" "),

  heading: [
    "text-center leading-tight",
    "text-[var(--theme-color-title)]",
    "text-[length:var(--theme-titleFontSize)]",
    "[font-weight:var(--theme-titleFontWeight)]",
  ].join(" "),

  textBody: [
    "text-center leading-snug",
    "text-[var(--theme-color-subtitle)]",
    "text-[length:var(--theme-subtitleFontSize)]",
  ].join(" "),

  textLabel: [
    "text-left mt-0",
    "text-[var(--theme-color-label)]",
    "text-[length:var(--theme-labelFontSize)]",
  ].join(" "),

  resultContent: [
    "flex flex-col items-center justify-center gap-4 text-center",
    "w-full max-w-[var(--theme-contentMaxWidth)]",
  ].join(" "),

  resultLabel: [
    "text-center mt-0",
    "text-[var(--theme-color-label)]",
    "text-[length:var(--theme-labelFontSize)]",
  ].join(" "),

  resultNumber: [
    "text-center text-4xl font-bold mt-2",
    "text-[var(--theme-color-title)]",
  ].join(" "),

  formError: "text-center text-sm text-red-400 mt-2",

  inputWrapper: "w-full",

  inputWithVoice: "relative w-full",

  inputFieldWithVoiceButton: "pr-9",

  voiceButton: [
    "absolute right-0 top-1/2 -translate-y-1/2",
    "flex items-center justify-center",
    "size-7 border-0 bg-transparent cursor-pointer p-0",
    "text-[var(--theme-color-inputCounter)] transition-colors duration-200",
    "hover:text-[var(--theme-color-inputText)]",
    "disabled:cursor-not-allowed disabled:opacity-40",
  ].join(" "),

  voiceButtonActive: "text-[var(--theme-color-title)] animate-pulse",

  voiceError: "block mt-1 text-xs text-red-400",

  inputFieldBase: [
    "w-full appearance-none bg-transparent outline-none ring-0 shadow-none rounded-none",
    "border-0 border-b border-solid py-2 transition-colors duration-200",
    "border-b-[length:var(--theme-inputBorderWidth)]",
    "text-[var(--theme-color-inputText)] text-[length:var(--theme-labelFontSize)]",
    "placeholder:text-[var(--theme-color-inputPlaceholder)]",
    "placeholder:text-[length:var(--theme-inputPlaceholderFontSize)]",
    "focus:outline-none focus:ring-0",
  ].join(" "),

  inputFieldDefault: "border-b-[var(--theme-color-inputBorder)]",

  inputFieldEmpty: "border-b-[var(--theme-color-inputBorderEmpty)]",

  inputFieldFilled: "border-b-[var(--theme-color-inputBorderFilled)]",

  inputCounter: [
    "block mt-1.5 text-right text-xs",
    "text-[var(--theme-color-inputCounter)]",
  ].join(" "),

  button: [
    "w-full border-0 cursor-pointer transition-opacity duration-200",
    "text-[length:var(--theme-buttonFontSize)] [font-weight:var(--theme-buttonFontWeight)]",
    "p-[var(--theme-buttonPadding)] rounded-[var(--theme-buttonBorderRadius)]",
    "bg-[var(--theme-color-buttonBackground)] text-[var(--theme-color-buttonText)]",
    "hover:enabled:opacity-90",
    "disabled:cursor-not-allowed",
    "disabled:bg-[var(--theme-color-buttonDisabledBackground)]",
    "disabled:text-[var(--theme-color-buttonDisabledText)]",
    "mt-6",
  ].join(" "),
} as const;

export const getInputFieldClasses = (
  isEmpty: boolean,
  isTouched: boolean,
): string => {
  let borderClass: string;

  if (!isTouched) {
    borderClass = themeClasses.inputFieldDefault;
  } else if (isEmpty) {
    borderClass = themeClasses.inputFieldEmpty;
  } else {
    borderClass = themeClasses.inputFieldFilled;
  }

  return [themeClasses.inputFieldBase, borderClass].join(" ");
}
