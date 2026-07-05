import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrimaryButton } from "../../welcome/components/ui/PrimaryButton";

describe("PrimaryButton", () => {
  it("renderiza el texto del botón", () => {
    render(<PrimaryButton>Comenzar</PrimaryButton>);

    expect(screen.getByRole("button", { name: "Comenzar" })).toBeInTheDocument();
  });

  it("respeta la prop disabled", () => {
    render(<PrimaryButton disabled>Comenzar</PrimaryButton>);

    expect(screen.getByRole("button", { name: "Comenzar" })).toBeDisabled();
  });
});
