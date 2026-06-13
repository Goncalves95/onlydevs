import { describe, it, expect } from "vitest";
import {
  calcShipping,
  getCurrencyForCountry,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "@/lib/shipping";

describe("FREE_SHIPPING_THRESHOLD", () => {
  it("is 8000 cents (CHF/EUR 80.00)", () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(8000);
  });
});

describe("STANDARD_SHIPPING_FEE", () => {
  it("CHF fee is 690 cents (6.90)", () => {
    expect(STANDARD_SHIPPING_FEE.CHF).toBe(690);
  });

  it("EUR fee is 590 cents (5.90)", () => {
    expect(STANDARD_SHIPPING_FEE.EUR).toBe(590);
  });
});

describe("getCurrencyForCountry", () => {
  it("returns CHF for Switzerland", () => {
    expect(getCurrencyForCountry("CH")).toBe("CHF");
  });

  it("returns EUR for Germany", () => {
    expect(getCurrencyForCountry("DE")).toBe("EUR");
  });

  it("returns EUR for France", () => {
    expect(getCurrencyForCountry("FR")).toBe("EUR");
  });

  it("returns EUR for Portugal", () => {
    expect(getCurrencyForCountry("PT")).toBe("EUR");
  });

  it("returns EUR for unknown country", () => {
    expect(getCurrencyForCountry("US")).toBe("EUR");
  });
});

describe("calcShipping", () => {
  it("returns 0 when subtotal meets free threshold (CHF)", () => {
    expect(calcShipping(8000, "CHF")).toBe(0);
  });

  it("returns 0 when subtotal exceeds free threshold (EUR)", () => {
    expect(calcShipping(9000, "EUR")).toBe(0);
  });

  it("returns standard CHF fee when below threshold", () => {
    expect(calcShipping(7999, "CHF")).toBe(690);
  });

  it("returns standard EUR fee when below threshold", () => {
    expect(calcShipping(7999, "EUR")).toBe(590);
  });

  it("returns fee for zero subtotal (CHF)", () => {
    expect(calcShipping(0, "CHF")).toBe(690);
  });

  it("returns fee for zero subtotal (EUR)", () => {
    expect(calcShipping(0, "EUR")).toBe(590);
  });
});
