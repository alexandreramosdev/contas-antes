import { describe, expect, it } from "vitest";
import { CATEGORIES, inferCategory, normalizeNameKey } from "@/src/lib/categories";

describe("normalizeNameKey", () => {
  it("lowercases, trims and collapses spaces", () => {
    expect(normalizeNameKey("  Arroz   Integral  ")).toBe("arroz integral");
  });

  it("strips accents", () => {
    expect(normalizeNameKey("AÇÚCAR")).toBe("acucar");
    expect(normalizeNameKey("pão de queijo")).toBe("pao de queijo");
  });

  it("handles empty and whitespace-only names", () => {
    expect(normalizeNameKey("")).toBe("");
    expect(normalizeNameKey("   ")).toBe("");
  });
});

describe("CATEGORIES", () => {
  it("contains the nine categories plus Outros", () => {
    expect(CATEGORIES).toHaveLength(10);
    expect(CATEGORIES).toContain("Outros");
  });
});

describe("inferCategory", () => {
  it("infers every category from its keywords", () => {
    expect(inferCategory("banana")).toBe("Hortifruti");
    expect(inferCategory("maçã")).toBe("Hortifruti");
    expect(inferCategory("tomate")).toBe("Hortifruti");

    expect(inferCategory("frango")).toBe("Carnes e Peixes");
    expect(inferCategory("picanha")).toBe("Carnes e Peixes");
    expect(inferCategory("tilápia")).toBe("Carnes e Peixes");

    expect(inferCategory("pão")).toBe("Padaria");
    expect(inferCategory("bolo")).toBe("Padaria");
    expect(inferCategory("croissant")).toBe("Padaria");

    expect(inferCategory("leite")).toBe("Laticínios e Ovos");
    expect(inferCategory("queijo")).toBe("Laticínios e Ovos");
    expect(inferCategory("ovos")).toBe("Laticínios e Ovos");

    expect(inferCategory("arroz")).toBe("Mercearia");
    expect(inferCategory("feijão")).toBe("Mercearia");
    expect(inferCategory("macarrão")).toBe("Mercearia");

    expect(inferCategory("refrigerante")).toBe("Bebidas");
    expect(inferCategory("suco")).toBe("Bebidas");
    expect(inferCategory("cerveja")).toBe("Bebidas");

    expect(inferCategory("pizza")).toBe("Congelados");
    expect(inferCategory("sorvete")).toBe("Congelados");
    expect(inferCategory("nuggets")).toBe("Congelados");

    expect(inferCategory("detergente")).toBe("Limpeza");
    expect(inferCategory("vassoura")).toBe("Limpeza");
    expect(inferCategory("amaciante")).toBe("Limpeza");

    expect(inferCategory("sabonete")).toBe("Higiene e Beleza");
    expect(inferCategory("shampoo")).toBe("Higiene e Beleza");
    expect(inferCategory("papel higiênico")).toBe("Higiene e Beleza");
  });

  it("prefers multi-word matches over single tokens", () => {
    expect(inferCategory("creme de leite")).toBe("Laticínios e Ovos");
    expect(inferCategory("creme dental")).toBe("Higiene e Beleza");
    expect(inferCategory("sabão em pó")).toBe("Limpeza");
    expect(inferCategory("batata frita")).toBe("Congelados");
    expect(inferCategory("pão de queijo")).toBe("Padaria");
  });

  it("ignores accents and case", () => {
    expect(inferCategory("AÇÚCAR")).toBe("Mercearia");
    expect(inferCategory("Limão")).toBe("Hortifruti");
    expect(inferCategory("SABÃO EM PÓ")).toBe("Limpeza");
  });

  it("matches keywords inside longer names", () => {
    expect(inferCategory("papel higiênico folha dupla")).toBe("Higiene e Beleza");
    expect(inferCategory("banana prata")).toBe("Hortifruti");
    expect(inferCategory("grão de bico")).toBe("Mercearia");
    expect(inferCategory("grão-de-bico")).toBe("Mercearia");
  });

  it("breaks equal-length keyword ties by declaration order", () => {
    expect(inferCategory("pão com sal")).toBe("Padaria");
  });

  it("falls back to Outros", () => {
    expect(inferCategory("xyzabc")).toBe("Outros");
    expect(inferCategory("")).toBe("Outros");
  });

  it("does not match keywords as substrings of tokens", () => {
    expect(inferCategory("saboneteira")).toBe("Outros");
  });
});
