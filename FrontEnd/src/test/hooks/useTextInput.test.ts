import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { useTextInput } from "../../welcome/hooks/useTextInput";

describe("useTextInput", () => {
  it("inicia vacío y sin tocar", () => {
    const { result } = renderHook(() => useTextInput("", vi.fn()));

    expect(result.current.isEmpty).toBe(true);
    expect(result.current.isTouched).toBe(false);
  });

  it("detecta cuando el valor no está vacío", () => {
    const { result } = renderHook(() => useTextInput("Ana", vi.fn()));

    expect(result.current.isEmpty).toBe(false);
  });

  it("handleChange propaga el valor al callback", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useTextInput("", onChange));

    act(() => {
      result.current.handleChange({
        target: { value: "Pedro" },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(onChange).toHaveBeenCalledWith("Pedro");
  });

  it("handleFocus marca el campo como tocado", () => {
    const { result } = renderHook(() => useTextInput("", vi.fn()));

    act(() => {
      result.current.handleFocus();
    });

    expect(result.current.isTouched).toBe(true);
  });

  it("handleBlur marca el campo como tocado", () => {
    const { result } = renderHook(() => useTextInput("", vi.fn()));

    act(() => {
      result.current.handleBlur();
    });

    expect(result.current.isTouched).toBe(true);
  });

  it("no vuelve a cambiar isTouched si ya fue tocado", () => {
    const { result } = renderHook(() => useTextInput("", vi.fn()));

    act(() => {
      result.current.handleFocus();
    });

    act(() => {
      result.current.handleFocus();
      result.current.handleBlur();
    });

    expect(result.current.isTouched).toBe(true);
  });
});
