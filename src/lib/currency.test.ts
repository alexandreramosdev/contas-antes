import { describe, expect, it } from "vitest";
import { formatBRL, formatPriceInput, parsePriceToCents } from "@/src/lib/currency";

const normalizeSpaces = (value: string) => value.replace(/\u00a0/g, " ");

describe("parsePriceToCents", () => {
  it("parses comma decimals", () => {
    expect(parsePriceToCents("15,99")).toBe(1599);
    expect(parsePriceToCents("0,5")).toBe(50);
    expect(parsePriceToCents("15,")).toBe(1500);
  });

  it("parses dot decimals with two digits", () => {
    expect(parsePriceToCents("15.99")).toBe(1599);
  });

  it("treats dots as thousands separators when not decimal", () => {
    expect(parsePriceToCents("1.234")).toBe(123400);
    expect(parsePriceToCents("1.234.567")).toBe(123456700);
  });

  it("parses values with the R$ prefix", () => {
    expect(parsePriceToCents("R$ 1.234,56")).toBe(123456);
    expect(parsePriceToCents("  R$ 12,00  ")).toBe(1200);
  });

  it("parses integers as whole reais", () => {
    expect(parsePriceToCents("10")).toBe(1000);
  });

  it("returns null for invalid input", () => {
    expect(parsePriceToCents("")).toBeNull();
    expect(parsePriceToCents("   ")).toBeNull();
    expect(parsePriceToCents("abc")).toBeNull();
    expect(parsePriceToCents("-5")).toBeNull();
    expect(parsePriceToCents("15,999")).toBeNull();
    expect(parsePriceToCents("1,2,3")).toBeNull();
    expect(parsePriceToCents(",")).toBeNull();
    expect(parsePriceToCents(".")).toBeNull();
    expect(parsePriceToCents("R$")).toBeNull();
  });
});

describe("formatBRL", () => {
  it("formats cents as Brazilian currency", () => {
    expect(normalizeSpaces(formatBRL(1599))).toBe("R$ 15,99");
    expect(normalizeSpaces(formatBRL(0))).toBe("R$ 0,00");
    expect(normalizeSpaces(formatBRL(50))).toBe("R$ 0,50");
    expect(normalizeSpaces(formatBRL(123456))).toBe("R$ 1.234,56");
  });
});

describe("formatPriceInput", () => {
  it("formats cents for the price input", () => {
    expect(formatPriceInput(1599)).toBe("15,99");
    expect(formatPriceInput(50)).toBe("0,50");
    expect(formatPriceInput(0)).toBe("0,00");
    expect(formatPriceInput(123456)).toBe("1234,56");
  });

  it("round-trips with parsePriceToCents", () => {
    [0, 50, 1599, 123456].forEach((cents) => {
      expect(parsePriceToCents(formatPriceInput(cents))).toBe(cents);
    });
  });
});
