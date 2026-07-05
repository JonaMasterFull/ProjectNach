import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSpeechDictation } from "../../hooks/useSpeechDictation";
import type {
  SpeechRecognitionInstance,
  SpeechRecognitionResultEvent,
} from "../../lib/types/speechRecognition.types";
import * as speechRecognition from "../../lib/speechRecognition";

const createMockRecognition = (): SpeechRecognitionInstance => {
  return {
    lang: "",
    continuous: false,
    interimResults: false,
    maxAlternatives: 1,
    start: vi.fn(),
    stop: vi.fn(),
    abort: vi.fn(),
    onresult: null,
    onerror: null,
    onend: null,
  };
};

vi.mock("../../lib/speechRecognition", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../lib/speechRecognition")>();

  return {
    ...actual,
    getSpeechRecognition: vi.fn(),
  };
});

describe("useSpeechDictation", () => {
  let mockRecognition: SpeechRecognitionInstance;

  class MockSpeechRecognition {
    constructor() {
      mockRecognition = createMockRecognition();
      return mockRecognition as unknown as MockSpeechRecognition;
    }
  }

  beforeEach(() => {
    vi.mocked(speechRecognition.getSpeechRecognition).mockReturnValue(
      MockSpeechRecognition as unknown as NonNullable<
        ReturnType<typeof speechRecognition.getSpeechRecognition>
      >,
    );
  });

  it("reporta isSupported cuando el navegador tiene SpeechRecognition", () => {
    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    expect(result.current.isSupported).toBe(true);
  });

  it("reporta isSupported false si no hay API de voz", () => {
    vi.mocked(speechRecognition.getSpeechRecognition).mockReturnValue(null);

    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    expect(result.current.isSupported).toBe(false);
  });

  it("startListening configura reconocimiento e inicia escucha", () => {
    const { result } = renderHook(() =>
      useSpeechDictation({ lang: "es-MX", onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.startListening();
    });

    expect(mockRecognition.lang).toBe("es-MX");
    expect(mockRecognition.continuous).toBe(false);
    expect(mockRecognition.interimResults).toBe(false);
    expect(mockRecognition.maxAlternatives).toBe(1);
    expect(mockRecognition.start).toHaveBeenCalledTimes(1);
    expect(result.current.isListening).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("startListening muestra error si el navegador no soporta dictado", () => {
    vi.mocked(speechRecognition.getSpeechRecognition).mockReturnValue(null);

    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.startListening();
    });

    expect(result.current.error).toBe("Tu navegador no soporta dictado por voz.");
    expect(result.current.isListening).toBe(false);
  });

  it("onresult entrega transcript formateado al callback", () => {
    const onTranscript = vi.fn();
    const { result } = renderHook(() =>
      useSpeechDictation({ maxLength: 10, onTranscript }),
    );

    act(() => {
      result.current.startListening();
    });

    const event = {
      resultIndex: 0,
      results: {
        length: 1,
        0: { isFinal: true, 0: { transcript: "  hola mundo  " } },
      },
    } satisfies SpeechRecognitionResultEvent;

    act(() => {
      mockRecognition.onresult?.(event);
    });

    expect(onTranscript).toHaveBeenCalledWith("Hola mundo");
  });

  it("onresult no llama onTranscript si el texto queda vacío", () => {
    const onTranscript = vi.fn();
    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript }),
    );

    act(() => {
      result.current.startListening();
    });

    act(() => {
      mockRecognition.onresult?.({
        resultIndex: 0,
        results: { length: 0 },
      });
    });

    expect(onTranscript).not.toHaveBeenCalled();
  });

  it("onerror guarda mensaje y detiene escucha", () => {
    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.startListening();
    });

    act(() => {
      mockRecognition.onerror?.({ error: "no-speech" });
    });

    expect(result.current.error).toBe("No se detectó voz. Intenta de nuevo.");
    expect(result.current.isListening).toBe(false);
  });

  it("onerror ignora aborted", () => {
    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.startListening();
    });

    act(() => {
      mockRecognition.onerror?.({ error: "aborted" });
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isListening).toBe(false);
  });

  it("onend detiene el estado de escucha", () => {
    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.startListening();
    });

    act(() => {
      mockRecognition.onend?.();
    });

    expect(result.current.isListening).toBe(false);
  });

  it("stopListening detiene reconocimiento y escucha", () => {
    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.startListening();
    });

    act(() => {
      result.current.stopListening();
    });

    expect(mockRecognition.stop).toHaveBeenCalledTimes(1);
    expect(result.current.isListening).toBe(false);
  });

  it("toggleListening alterna entre iniciar y detener", () => {
    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.toggleListening();
    });
    expect(result.current.isListening).toBe(true);

    act(() => {
      result.current.toggleListening();
    });
    expect(mockRecognition.stop).toHaveBeenCalledTimes(1);
    expect(result.current.isListening).toBe(false);
  });

  it("startListening captura error si start falla", () => {
    class FailingSpeechRecognition {
      constructor() {
        mockRecognition = createMockRecognition();
        mockRecognition.start = vi.fn(() => {
          throw new Error("start failed");
        });
        return mockRecognition as unknown as FailingSpeechRecognition;
      }
    }

    vi.mocked(speechRecognition.getSpeechRecognition).mockReturnValue(
      FailingSpeechRecognition as unknown as NonNullable<
        ReturnType<typeof speechRecognition.getSpeechRecognition>
      >,
    );

    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.startListening();
    });

    expect(result.current.error).toBe(
      "No se pudo iniciar el dictado. Intenta de nuevo.",
    );
    expect(result.current.isListening).toBe(false);
  });

  it("aborta reconocimiento al desmontar", () => {
    const { result, unmount } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.startListening();
    });

    unmount();

    expect(mockRecognition.abort).toHaveBeenCalled();
  });

  it("aborta reconocimiento previo antes de iniciar uno nuevo", () => {
    const { result } = renderHook(() =>
      useSpeechDictation({ onTranscript: vi.fn() }),
    );

    act(() => {
      result.current.startListening();
    });

    const firstRecognition = mockRecognition;

    act(() => {
      result.current.startListening();
    });

    expect(firstRecognition.abort).toHaveBeenCalled();
  });
});
