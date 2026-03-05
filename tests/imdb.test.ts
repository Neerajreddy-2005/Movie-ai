import { describe, expect, it } from "vitest";
import { validateImdbId } from "@/lib/imdb";

describe("validateImdbId", () => {
  it("accepts valid IMDb ids", () => {
    expect(validateImdbId("tt0133093")).toBe("tt0133093");
    expect(validateImdbId("  tt1375666 ")).toBe("tt1375666");
  });

  it("rejects invalid ids", () => {
    expect(() => validateImdbId("")).toThrow();
    expect(() => validateImdbId("12345")).toThrow();
    expect(() => validateImdbId("ttabc")).toThrow();
  });
});

