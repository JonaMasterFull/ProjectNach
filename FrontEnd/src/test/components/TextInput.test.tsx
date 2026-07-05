import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { TextInput } from "../../welcome/components/ui/TextInput";
import { renderWithTheme } from "../test-utils";

describe("TextInput", () => {
  it("renderiza placeholder y contador de caracteres", () => {
    renderWithTheme(<TextInput value="" onChange={vi.fn()} />);

    expect(screen.getByPlaceholderText("Escribe tu nombre")).toBeInTheDocument();
    expect(screen.getByText("0/15 caracteres")).toBeInTheDocument();
  });

  it("notifica cambios al escribir", () => {
    const onChange = vi.fn();
    renderWithTheme(<TextInput value="" onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText("Escribe tu nombre"), {
      target: { value: "Lu" },
    });

    expect(onChange).toHaveBeenCalledWith("Lu");
  });

  it("actualiza el contador con el valor actual", () => {
    renderWithTheme(<TextInput value="Ana" onChange={vi.fn()} />);

    expect(screen.getByText("3/15 caracteres")).toBeInTheDocument();
  });
});
