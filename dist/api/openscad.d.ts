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
export declare function createOpenSCAD(options?: InitOptions): Promise<OpenSCADInstance>;
