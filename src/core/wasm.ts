import wasmWrapper from "../../wasm/openscad.wasm.js";
import wasm from "../../wasm/openscad.wasm";

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

  const module: Partial<OpenSCAD> = {
    noInitialRun: true,
    print: options.print || defaultPrint,
    printErr: options.printErr || defaultPrintErr,
    onerror: (e: any) => console.error("[OpenSCAD Error]:", e),
    ...options,
  };

  const { instance } = await wasm(module);
  const wasmModule = await wasmWrapper(instance);

  return wasmModule as OpenSCAD;
}
