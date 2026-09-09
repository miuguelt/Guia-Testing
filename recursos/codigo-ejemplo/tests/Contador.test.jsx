import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Contador from "../src/components/Contador.jsx";

describe("Contador", () => {
  it("inicia en 0", () => {
    render(<Contador />);
    expect(screen.getByText(/contador: 0/i)).toBeInTheDocument();
  });

  it("incrementa al hacer clic", () => {
    render(<Contador />);
    fireEvent.click(screen.getByRole("button", { name: /incrementar/i }));
    expect(screen.getByText(/contador: 1/i)).toBeInTheDocument();
  });

  it("decrementa al hacer clic", () => {
    render(<Contador />);
    fireEvent.click(screen.getByRole("button", { name: /decrementar/i }));
    expect(screen.getByText(/contador: -1/i)).toBeInTheDocument();
  });
});
