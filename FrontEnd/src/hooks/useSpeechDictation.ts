import { useCallback, useEffect, useRef, useState } from "react";
import {
  extractFinalTranscript,
  formatSpeechTranscript,
  getSpeechErrorMessage,
  getSpeechRecognition,
} from "../lib/speechRecognition";
import type {
  SpeechRecognitionErrorEventData,
  SpeechRecognitionInstance,
  SpeechRecognitionResultEvent,
} from "../lib/types/speechRecognition.types";

interface UseSpeechDictationOptions {
  lang?: string;
  maxLength?: number;
  onTranscript: (text: string) => void;
}

export const useSpeechDictation = ({
  lang = "es-MX",
  maxLength,
  onTranscript,
}: UseSpeechDictationOptions) => {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const maxLengthRef = useRef(maxLength);
  
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = getSpeechRecognition() !== null;

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    maxLengthRef.current = maxLength;
  }, [onTranscript, maxLength]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionClass = getSpeechRecognition();
    if (!SpeechRecognitionClass) {
      setError("Tu navegador no soporta dictado por voz.");
      return;
    }

    recognitionRef.current?.abort();
    setError(null);

    const recognition = new SpeechRecognitionClass();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      const finalText = formatSpeechTranscript(
        extractFinalTranscript(event),
        maxLengthRef.current,
      );

      if (finalText) {
        onTranscriptRef.current(finalText);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventData) => {
      if (event.error !== "aborted") {
        setError(getSpeechErrorMessage(event.error));
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setError("No se pudo iniciar el dictado. Intenta de nuevo.");
      setIsListening(false);
    }
  }, [lang]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return {
    isSupported,
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}
