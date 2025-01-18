import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

const bundle = (name) => ({
  input: `src/${name}.ts`,
  output: {
    file: `dist/${name}.js`,
    format: "esm",
  },
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    copy({
      targets: [{ src: "../wasm/openscad.wasm*", dest: "dist" }],
    }),
  ],
});

export default [bundle("openscad")];
