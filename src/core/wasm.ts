import wasmWrapper from "../../wasm/openscad.wasm.js";

import type { InitOptions, OpenSCAD } from "../types/openscad";

export async function initWasm(options: InitOptions = {}): Promise<OpenSCAD> {
  const module: Partial<OpenSCAD> = {
    noInitialRun: true,
    ...options,
  };

  const wasmModule = await wasmWrapper({
    noInitialRun: true,
  });

  console.log(wasmModule);

  return wasmModule as OpenSCAD;
}
