export type StoreType = "Elektra" | "ShopingBaz";

export interface ThemeTexts {
  welcomeTitleLine1: string;
  welcomeTitleLine2: string;
  welcomeSubtitle: string;
  nameQuestion: string;
  namePlaceholder: string;
  startButton: string;
  submittingButton: string;
  submitError: string;
  characterCounterTemplate: string;
  nameMaxLength: number;
  resultTitleLine1: string;
  resultTitleLine2: string;
  resultGreeting: string;
  resultNumberLabel: string;
  resultLoading: string;
  resultBackButton: string;
  voiceInputStart: string;
  voiceInputStop: string;
}

export interface ThemeColors {
  background: string;
  title: string;
  subtitle: string;
  label: string;
  inputText: string;
  inputPlaceholder: string;
  inputBorder: string;
  inputBorderEmpty: string;
  inputBorderFilled: string;
  inputCounter: string;
  buttonBackground: string;
  buttonText: string;
  buttonDisabledBackground: string;
  buttonDisabledText: string;
}

export interface ThemeStyles {
  fontFamily: string;
  titleFontSize: string;
  titleFontWeight: string;
  subtitleFontSize: string;
  labelFontSize: string;
  inputPlaceholderFontSize: string;
  buttonFontSize: string;
  buttonFontWeight: string;
  buttonBorderRadius: string;
  buttonPadding: string;
  inputBorderWidth: string;
  pagePaddingX: string;
  pagePaddingBottom: string;
  contentMaxWidth: string;
  logoMaxWidth: string;
  illustrationMaxWidth: string;
}

export interface ThemeAssets {
  logo: string;
  illustration: string;
}

export interface ThemeConfig {
  id: StoreType;
  assets: ThemeAssets;
  texts: ThemeTexts;
  colors: ThemeColors;
  styles: ThemeStyles;
}
