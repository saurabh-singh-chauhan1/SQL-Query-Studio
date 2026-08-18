import { describe, it, expect } from "vitest";

// Mirrors backend diff_service semantics on the client-visible shape.
function isIdentical(a: Record<string, unknown>[], b: Record<string, unknown>[]) {
  const norm = (rows: Record<string, unknown>[]) => new Set(rows.map((r) => JSON.stringify(r)));
  const setA = norm(a), setB = norm(b);
  if (setA.size !== setB.size) return false;
  for (const v of setA) if (!setB.has(v)) return false;
  return true;
}

describe("result diff helper", () => {
  it("flags identical row sets", () => {
    expect(isIdentical([{ id: 1 }], [{ id: 1 }])).toBe(true);
  });
  it("flags differing row sets", () => {
    expect(isIdentical([{ id: 1 }], [{ id: 2 }])).toBe(false);
  });
});
