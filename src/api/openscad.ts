import { initWasm } from "../core/wasm";
import type { InitOptions, OpenSCAD } from "../types/openscad";

export interface OpenSCADInstance {
  /**
   * Render OpenSCAD code to STL
   * @param code The OpenSCAD source code
   * @returns STL file contents as string
   */
  renderToStl(code: string): Promise<string>;

  /**
   * Get the underlying OpenSCAD instance
   * Provides direct access to the WASM module if needed
   */
  getInstance(): OpenSCAD;
}

export async function createOpenSCAD(
  options: InitOptions = {}
): Promise<OpenSCADInstance> {
  const instance = await initWasm(options);

  return {
    async renderToStl(code: string): Promise<string> {
      // Write code to input file
      instance.FS.writeFile("/input.scad", code);

      // Run OpenSCAD with appropriate flags
      instance.callMain(["/input.scad", "-o", "/output.stl"]);

      // Read output file
      const result = instance.FS.readFile("/output.stl", { encoding: "utf8" });

      // Cleanup
      instance.FS.unlink("/input.scad");
      instance.FS.unlink("/output.stl");

      return result;
    },

    getInstance(): OpenSCAD {
      return instance;
    },
  };
}
