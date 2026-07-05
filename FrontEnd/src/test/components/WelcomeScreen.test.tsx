import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { WelcomeScreen } from "../../welcome/components/WelcomeScreen";
import { renderWithTheme } from "../test-utils";

describe("WelcomeScreen", () => {
  it("deshabilita el botón cuando el nombre está vacío", () => {
    renderWithTheme(<WelcomeScreen />);

    expect(screen.getByRole("button", { name: "Comenzar" })).toBeDisabled();
  });

  it("habilita el botón al escribir un nombre válido", () => {
    renderWithTheme(<WelcomeScreen />);

    fireEvent.change(screen.getByPlaceholderText("Escribe tu nombre"), {
      target: { value: "Ana" },
    });

    expect(screen.getByRole("button", { name: "Comenzar" })).not.toBeDisabled();
  });

  it("llama onSubmit con nombre y storeType", async () => {
    const onSubmit = vi.fn();
    renderWithTheme(<WelcomeScreen onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("Escribe tu nombre"), {
      target: { value: "  Pedro  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Comenzar" }));

    expect(onSubmit).toHaveBeenCalledWith("Pedro", "Elektra");
  });

  it("muestra error de envío cuando hasSubmitError es true", () => {
    renderWithTheme(<WelcomeScreen hasSubmitError />);

    expect(
      screen.getByText("No se pudo registrar. Intenta de nuevo."),
    ).toBeInTheDocument();
  });

  it("muestra texto de procesando mientras envía", () => {
    renderWithTheme(<WelcomeScreen isSubmitting />);

    expect(screen.getByRole("button", { name: "Procesando..." })).toBeDisabled();
  });
});
