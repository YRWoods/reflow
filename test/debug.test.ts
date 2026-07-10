import { renderHook } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

describe("debug", () => {
  it("inspect renderHook result", () => {
    const { result } = renderHook(() => {
      const [val] = createSignal(1);
      return val;
    });
    console.log("Result object:", result);
    console.log("Keys of result:", Object.keys(result));
    // @ts-ignore
    console.log("Result.current:", result.current);
    // @ts-ignore
    console.log("Result.get:", result.get);
    // @ts-ignore
    console.log("Result():", typeof result);
  });
});
