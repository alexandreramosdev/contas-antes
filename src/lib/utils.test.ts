import { afterEach, describe, expect, it, vi } from "vitest";
import { cn, generateId } from "@/src/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("flex", false && "hidden", undefined, "items-center")).toBe(
      "flex items-center",
    );
  });

  it("resolves conflicting Tailwind classes in favor of the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("bg-zinc-900", "bg-emerald-500")).toBe("bg-emerald-500");
  });
});

describe("generateId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("generates unique UUID v4 identifiers", () => {
    const first = generateId();
    const second = generateId();
    const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

    expect(first).toMatch(uuidV4);
    expect(second).toMatch(uuidV4);
    expect(first).not.toBe(second);
  });

  it("falls back to getRandomValues when randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (array: Uint8Array) => array.fill(0xab),
    });

    expect(generateId()).toBe("abababab-abab-4bab-abab-abababababab");
  });
});