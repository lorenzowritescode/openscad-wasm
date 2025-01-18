import wasmModule from "../../wasm/openscad.wasm.js";
import type { InitOptions, OpenSCAD } from "../types/openscad";

export async function initWasm(options: InitOptions = {}): Promise<OpenSCAD> {
  const module: Partial<OpenSCAD> = {
    noInitialRun: true,
    ...options,
  };

  // Initialize the module
  const instance = await wasmModule(module);

  // Wait for runtime initialization
  await new Promise<void>((resolve) => {
    instance.onRuntimeInitialized = () => resolve();
  });

  return instance as OpenSCAD;
}
