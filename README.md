# OpenSCAD WASM Port

A full port of OpenSCAD to WASM, providing a modern TypeScript API for rendering OpenSCAD models directly in the browser or Node.js.

## Setup

Make sure that you have the following installed:

- Make
- wget
- Docker
- Node.js 18+

To build the project:

```bash
# Build the WASM module and runtime
make all

# Build just the runtime package
cd runtime && npm run build
```

## Usage

Install the package:

```bash
npm install openscad-wasm
```

Basic usage:

```typescript
import { createOpenSCAD } from "openscad-wasm";

// Create an OpenSCAD instance
const openscad = await createOpenSCAD();

// Render some OpenSCAD code to STL
const stl = await openscad.renderToStl(`
  cube([10, 10, 10]);
`);

// Do something with the STL (e.g., save to file, display in viewer)
console.log(stl);
```

Advanced usage with direct access to the WASM module:

```typescript
import { createOpenSCAD } from "openscad-wasm";

const openscad = await createOpenSCAD({
  // Optional callbacks for stdout/stderr
  print: console.log,
  printErr: console.error,
});

// Get direct access to the WASM module
const instance = openscad.getInstance();

// Use the filesystem API directly
instance.FS.writeFile("/input.scad", "cube([20, 20, 20]);");
instance.callMain(["/input.scad", "--enable=manifold", "-o", "output.stl"]);
const output = instance.FS.readFile("/output.stl", { encoding: "utf8" });
```

## API Reference

### createOpenSCAD(options?)

Creates a new OpenSCAD instance.

```typescript
interface InitOptions {
  noInitialRun?: boolean; // Prevent automatic main() call
  print?: (text: string) => void; // stdout callback
  printErr?: (text: string) => void; // stderr callback
}

interface OpenSCADInstance {
  // Render OpenSCAD code to STL
  renderToStl(code: string): Promise<string>;

  // Get the underlying WASM module
  getInstance(): OpenSCAD;
}
```

### OpenSCAD Instance

The underlying WASM module provides:

```typescript
interface OpenSCAD {
  // Run OpenSCAD with command line arguments
  callMain(args: Array<string>): number;

  // Emscripten filesystem API
  FS: {
    writeFile(path: string, data: string | ArrayBufferView): void;
    readFile(
      path: string,
      opts?: { encoding: "utf8" | "binary" }
    ): string | Uint8Array;
    mkdir(path: string): void;
    rmdir(path: string): void;
    unlink(path: string): void;
    // ... and more
  };
}
```

For more information on the filesystem API, see the [Emscripten File System API](https://emscripten.org/docs/api_reference/Filesystem-API.html).

## Development

The project is structured as follows:

```
runtime/
  src/
    api/      # High-level TypeScript API
    core/     # WASM initialization
    types/    # TypeScript definitions
  wasm/     # Built WASM module
  dist/     # Built package
```

To develop:

```bash
# Watch mode for runtime package
cd runtime && npm run dev

# Run tests
make test
```
