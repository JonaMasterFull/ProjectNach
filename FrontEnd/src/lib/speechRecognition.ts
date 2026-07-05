import type {
  SpeechRecognitionConstructor,
  SpeechRecognitionErrorCode,
  SpeechRecognitionResultEvent,
} from "./types/speechRecognition.types";

export type {
  SpeechRecognitionErrorCode,
  SpeechRecognitionErrorEventData,
  SpeechRecognitionInstance,
  SpeechRecognitionResultEvent,
} from "./types/speechRecognition.types";

export const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  if (typeof window === "undefined") return null;

  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

export const formatSpeechTranscript = (
  raw: string,
  maxLength?: number,
): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const capitalized =
    trimmed.charAt(0).toLocaleUpperCase("es-MX") + trimmed.slice(1);

  return maxLength !== undefined
    ? capitalized.slice(0, maxLength)
    : capitalized;
};

export const getSpeechErrorMessage = (
  errorCode: SpeechRecognitionErrorCode,
): string => {
  switch (errorCode) {
    case "not-allowed":
      return "Permite el acceso al micrófono para usar dictado.";
    case "no-speech":
      return "No se detectó voz. Intenta de nuevo.";
    case "network":
      return "Error de red. Verifica tu conexión.";
    case "audio-capture":
      return "No se encontró un micrófono disponible.";
    case "language-not-supported":
      return "El idioma seleccionado no está soportado.";
    default:
      return "No se pudo capturar el audio. Intenta de nuevo.";
  }
};

export const extractFinalTranscript = (
  event: SpeechRecognitionResultEvent,
): string => {
  let transcript = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i];
    if (result.isFinal) {
      transcript += result[0]?.transcript ?? "";
    }
  }

  return transcript;
};
