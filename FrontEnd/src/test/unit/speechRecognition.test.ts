import { describe, expect, it } from "vitest";
import {
  extractFinalTranscript,
  formatSpeechTranscript,
  getSpeechErrorMessage,
} from "../../lib/speechRecognition";

describe("formatSpeechTranscript", () => {
  it("capitaliza y recorta espacios", () => {
    expect(formatSpeechTranscript("  hola mundo  ")).toBe("Hola mundo");
  });

  it("respeta maxLength", () => {
    expect(formatSpeechTranscript("abcdefghij", 5)).toBe("Abcde");
  });

  it("devuelve vacío si no hay texto", () => {
    expect(formatSpeechTranscript("   ")).toBe("");
  });
});

describe("getSpeechErrorMessage", () => {
  it("traduce not-allowed", () => {
    expect(getSpeechErrorMessage("not-allowed")).toContain("micrófono");
  });

  it("traduce no-speech", () => {
    expect(getSpeechErrorMessage("no-speech")).toContain("No se detectó voz");
  });

  it("usa mensaje genérico para errores desconocidos", () => {
    expect(getSpeechErrorMessage("aborted")).toContain(
      "No se pudo capturar el audio",
    );
  });
});

describe("extractFinalTranscript", () => {
  it("concatena solo resultados finales", () => {
    const event = {
      resultIndex: 0,
      results: {
        length: 2,
        0: { isFinal: true, 0: { transcript: "Hola " } },
        1: { isFinal: false, 0: { transcript: "mundo" } },
      },
    };

    expect(extractFinalTranscript(event)).toBe("Hola ");
  });
});
