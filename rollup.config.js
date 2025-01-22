import typescript from "@rollup/plugin-typescript";
import { wasm } from "@rollup/plugin-wasm";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const { parse } = require("@babel/parser");

export default {
  input: `src/openscad.ts`,
  output: {
    file: `dist/openscad.js`,
  },
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    wasm({
      targetEnv: "auto-inline",
      maxFileSize: 0,
    }),
    {
      name: "patch-findWasmBinary-function",
      renderChunk(code) {
        const replacementFunctionCode = `
        function findWasmBinary() {
          return;
        }
        `;

        const replacementAst = parse(replacementFunctionCode, {
          sourceType: "module",
        }).program.body[0];
        const ast = parse(code, { sourceType: "module" });

        traverse(ast, {
          FunctionDeclaration(path) {
            if (path.node.id?.name === "findWasmBinary") {
              path.replaceWith(replacementAst);
            }
          },
        });

        const { code: transformedCode } = generate(ast);
        return transformedCode;
      },
    },
  ],
};
