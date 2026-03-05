import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/movie/route";

describe("POST /api/movie", () => {
  it("returns 400 for missing imdbId", async () => {
    const req = {
      json: vi.fn().mockResolvedValue({})
    } as unknown as Request;

    const res = await POST(req);
    const json = await (res as Response).json();

    expect((res as Response).status).toBe(400);
    expect(json.error).toBeDefined();
  });
});

