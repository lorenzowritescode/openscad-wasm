import wasm from "../../wasm/openscad.wasm";
import wasmWrapper from "../../wasm/openscad.wasm.js";

import type { InitOptions, OpenSCAD } from "../types/openscad";

export async function initWasm(options: InitOptions = {}): Promise<OpenSCAD> {
  const defaultPrint = (text: string) => console.log("[OpenSCAD]:", text);
  const defaultPrintErr = (text: string) => {
    // Only treat it as an error if it's not just informational output
    if (text.toLowerCase().includes("error")) {
      console.error("[OpenSCAD Error]:", text);
    } else {
      console.log("[OpenSCAD]:", text);
    }
  };

  const wasmBinary = await wasm();

  const module: Partial<OpenSCAD> = {
    noInitialRun: true,
    noExitRuntime: true,
    print: options.print || defaultPrint,
    printErr: options.printErr || defaultPrintErr,
    onerror: (e: any) => console.error("[OpenSCAD Error]:", e),
    instantiateWasm(imports, receiveInstance) {
      WebAssembly.instantiate(wasmBinary, imports).then(receiveInstance);
    },
    ...options,
  };

  const openscadWasm = await wasmWrapper(module);

  return openscadWasm as OpenSCAD;
}
