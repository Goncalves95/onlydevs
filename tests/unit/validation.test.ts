import { describe, it, expect } from "vitest";
import { isValidEmail, isStrongPassword } from "@/lib/validation";

describe("isValidEmail", () => {
  it("accepts standard email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("accepts email with subdomain", () => {
    expect(isValidEmail("user@mail.example.co.uk")).toBe(true);
  });

  it("rejects missing @", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  it("rejects missing domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects missing TLD", () => {
    expect(isValidEmail("user@example")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects email with spaces", () => {
    expect(isValidEmail("user @example.com")).toBe(false);
  });
});

describe("isStrongPassword", () => {
  it("accepts password with uppercase and digit", () => {
    expect(isStrongPassword("Secure1pass")).toBe(true);
  });

  it("accepts exactly 8 chars with uppercase and digit", () => {
    expect(isStrongPassword("Abc12345")).toBe(true);
  });

  it("rejects password shorter than 8 chars", () => {
    expect(isStrongPassword("Abc123")).toBe(false);
  });

  it("rejects password with no uppercase", () => {
    expect(isStrongPassword("secure1pass")).toBe(false);
  });

  it("rejects password with no digit", () => {
    expect(isStrongPassword("SecurePass")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isStrongPassword("")).toBe(false);
  });
});
