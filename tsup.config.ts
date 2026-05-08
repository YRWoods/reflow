import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "react/index": "src/react/index.ts",
    "styles/index": "src/styles/index.ts",
    "server/index": "src/server/index.ts",
    "testing/index": "src/testing/index.ts",
    "tailwind/index": "src/tailwind/index.ts",
    "vue/index": "src/vue/index.ts",
    "svelte/index": "src/svelte/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  target: "es2020",
  external: ["react", "react-dom", "vue", "svelte", "svelte/store"],
});
