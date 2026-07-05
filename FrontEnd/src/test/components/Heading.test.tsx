import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getTheme } from "../../config/getTheme";
import { themeClasses } from "../../lib/themeClasses";
import { Heading } from "../../welcome/components/ui/Heading";

describe("Heading", () => {
  it("renderiza las dos líneas dentro de un h1", () => {
    render(<Heading line1="¡Te damos la" line2="bienvenida!" />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveClass(themeClasses.heading);
    expect(screen.getByText("¡Te damos la")).toBeInTheDocument();
    expect(screen.getByText("bienvenida!")).toBeInTheDocument();
  });

  it("coloca cada línea en un span con clase block", () => {
    render(<Heading line1="Línea A" line2="Línea B" />);

    const line1 = screen.getByText("Línea A");
    const line2 = screen.getByText("Línea B");

    expect(line1.tagName).toBe("SPAN");
    expect(line2.tagName).toBe("SPAN");
    expect(line1).toHaveClass("block");
    expect(line2).toHaveClass("block");
  });

  it("mantiene line1 antes de line2 en el DOM", () => {
    render(<Heading line1="Primera" line2="Segunda" />);

    const heading = screen.getByRole("heading", { level: 1 });
    const spans = heading.querySelectorAll("span.block");

    expect(spans).toHaveLength(2);
    expect(spans[0]).toHaveTextContent("Primera");
    expect(spans[1]).toHaveTextContent("Segunda");
  });

  it("expone ambas líneas en el nombre accesible del heading", () => {
    render(<Heading line1="¡Te damos la" line2="bienvenida a Préstamo Elektra!" />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveAccessibleName(
      "¡Te damos labienvenida a Préstamo Elektra!",
    );
    expect(heading.textContent).toBe(
      "¡Te damos labienvenida a Préstamo Elektra!",
    );
  });

  it("renderiza textos vacíos sin romper la estructura", () => {
    render(<Heading line1="" line2="" />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveClass(themeClasses.heading);
    expect(heading.querySelectorAll("span.block")).toHaveLength(2);
  });

  it("renderiza caracteres especiales y acentos", () => {
    render(
      <Heading
        line1="¿Cómo estás?"
        line2="Niño & señor — ¡hola!"
      />,
    );

    expect(screen.getByText("¿Cómo estás?")).toBeInTheDocument();
    expect(screen.getByText("Niño & señor — ¡hola!")).toBeInTheDocument();
  });

  it("actualiza el contenido al cambiar las props", () => {
    const { rerender } = render(
      <Heading line1="Texto inicial" line2="Subtítulo inicial" />,
    );

    expect(screen.getByText("Texto inicial")).toBeInTheDocument();

    rerender(<Heading line1="Texto nuevo" line2="Subtítulo nuevo" />);

    expect(screen.queryByText("Texto inicial")).not.toBeInTheDocument();
    expect(screen.getByText("Texto nuevo")).toBeInTheDocument();
    expect(screen.getByText("Subtítulo nuevo")).toBeInTheDocument();
  });

  it("muestra los textos de bienvenida del tema Elektra", () => {
    const theme = getTheme("Elektra");

    render(
      <Heading
        line1={theme.texts.welcomeTitleLine1}
        line2={theme.texts.welcomeTitleLine2}
      />,
    );

    expect(screen.getByText(theme.texts.welcomeTitleLine1)).toBeInTheDocument();
    expect(screen.getByText(theme.texts.welcomeTitleLine2)).toBeInTheDocument();
    expect(theme.texts.welcomeTitleLine2).toContain("Elektra");
  });

  it("muestra los textos de bienvenida del tema ShopingBaz", () => {
    const theme = getTheme("ShopingBaz");

    render(
      <Heading
        line1={theme.texts.welcomeTitleLine1}
        line2={theme.texts.welcomeTitleLine2}
      />,
    );

    expect(screen.getByText(theme.texts.welcomeTitleLine1)).toBeInTheDocument();
    expect(screen.getByText(theme.texts.welcomeTitleLine2)).toBeInTheDocument();
    expect(theme.texts.welcomeTitleLine2).toContain("shopinbaz");
  });
});
