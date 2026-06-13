import { describe, it, expect } from "vitest";
import { parseCurrencyCookie, formatPrice } from "@/lib/currency";

describe("parseCurrencyCookie", () => {
  it("returns CHF for 'CHF'", () => {
    expect(parseCurrencyCookie("CHF")).toBe("CHF");
  });

  it("returns EUR for 'EUR'", () => {
    expect(parseCurrencyCookie("EUR")).toBe("EUR");
  });

  it("returns null for unknown value", () => {
    expect(parseCurrencyCookie("USD")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseCurrencyCookie("")).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(parseCurrencyCookie(undefined)).toBeNull();
  });

  it("is case-sensitive (lowercase rejected)", () => {
    expect(parseCurrencyCookie("chf")).toBeNull();
  });
});

describe("formatPrice", () => {
  it("formats CHF amount in cents", () => {
    const result = formatPrice(1990, "CHF");
    expect(result).toContain("19.90");
    expect(result).toContain("CHF");
  });

  it("formats EUR amount in cents", () => {
    const result = formatPrice(590, "EUR");
    expect(result).toContain("5.90");
  });

  it("formats zero amount", () => {
    const result = formatPrice(0, "EUR");
    expect(result).toContain("0.00");
  });

  it("formats large amount", () => {
    const result = formatPrice(8000, "CHF");
    expect(result).toContain("80.00");
  });
});
