export default {
  process(sourceText, sourcePath, options) {
    const path = require("path");
    const url = require("url");

    // Get the absolute path of the source file
    const absolutePath = path.resolve(sourcePath);
    const sourceDir = path.dirname(absolutePath);
    const projectRoot = path.resolve(sourceDir, "..");

    // Create file URLs for the dependencies
    const wasmJsUrl = url.pathToFileURL(
      path.resolve(projectRoot, "dist/openscad.wasm.js")
    ).href;
    const wasmUrl = url.pathToFileURL(
      path.resolve(projectRoot, "dist/openscad.wasm")
    ).href;
    const fileUrl = url.pathToFileURL(absolutePath).href;

    // First replace any relative WebAssembly imports with absolute paths
    let transformedCode = sourceText.replace(
      /from\s+["']\.\.\/dist\/openscad\.wasm\.js["']/g,
      `from '${wasmJsUrl}'`
    );

    // Replace any direct references to the .wasm file
    transformedCode = transformedCode.replace(
      /["']\.\.\/dist\/openscad\.wasm["']/g,
      `'${wasmUrl}'`
    );

    // Replace import.meta.url with the file URL, handling both var _scriptName = import.meta.url and direct usage
    transformedCode = transformedCode.replace(
      /var\s+_scriptName\s*=\s*import\.meta\.url/g,
      `var _scriptName = '${fileUrl}'`
    );
    transformedCode = transformedCode.replace(
      /(?<!var\s+_scriptName\s*=\s*)import\.meta\.url/g,
      `'${fileUrl}'`
    );

    // Handle WebAssembly.instantiateStreaming by replacing it with WebAssembly.instantiate
    transformedCode = transformedCode.replace(
      /WebAssembly\.instantiateStreaming\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g,
      `fetch($1).then(response => response.arrayBuffer()).then(bytes => WebAssembly.instantiate(bytes, $2))`
    );

    return {
      code: transformedCode,
    };
  },
};
