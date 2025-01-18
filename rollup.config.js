import typescript from "@rollup/plugin-typescript";
import { wasm } from "@rollup/plugin-wasm";

export default {
  input: `src/openscad.ts`,
  output: {
    file: `dist/openscad.js`,
  },
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    wasm({
      targetEnv: "browser",
      fileName: "openscad.wasm",
    }),
  ],
};
