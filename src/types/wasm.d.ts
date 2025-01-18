declare module "*.wasm.js" {
  import type { OpenSCAD } from "./openscad";

  const createModule: (options?: Partial<OpenSCAD>) => Promise<OpenSCAD>;
  export default createModule;
}
