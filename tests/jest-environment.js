const NodeEnvironment = require("jest-environment-node").TestEnvironment;
const { fileURLToPath } = require("url");
const { readFileSync } = require("fs");
const { join } = require("path");

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);

    // Add required globals
    this.global.TextDecoder = TextDecoder;
    this.global.TextEncoder = TextEncoder;
    this.global.Uint8Array = Uint8Array;
    this.global.Int8Array = Int8Array;
    this.global.Uint16Array = Uint16Array;
    this.global.Int16Array = Int16Array;
    this.global.Int32Array = Int32Array;
    this.global.Uint32Array = Uint32Array;
    this.global.Float32Array = Float32Array;
    this.global.Float64Array = Float64Array;
    this.global.BigInt64Array = BigInt64Array;
    this.global.BigUint64Array = BigUint64Array;
    this.global.ArrayBuffer = ArrayBuffer;
    this.global.SharedArrayBuffer =
      typeof SharedArrayBuffer !== "undefined"
        ? SharedArrayBuffer
        : ArrayBuffer;
    this.global.DataView = DataView;
    this.global.URL = URL;
    this.global.Response = require("node-fetch").Response;
    this.global.Headers = require("node-fetch").Headers;
    this.global.Request = require("node-fetch").Request;
    this.global.fetch = require("node-fetch");
    this.global.performance = {
      now() {
        const [sec, nsec] = process.hrtime();
        return sec * 1000 + nsec / 1000000;
      },
    };

    // Add custom WebAssembly.instantiateStreaming
    const originalInstantiateStreaming = WebAssembly.instantiateStreaming;
    this.global.WebAssembly = {
      ...WebAssembly,
      async instantiateStreaming(response, importObject) {
        if (response instanceof Response) {
          const buffer = await response.arrayBuffer();
          return WebAssembly.instantiate(buffer, importObject);
        }
        throw new TypeError("Response expected");
      },
    };
  }
}

module.exports = CustomEnvironment;
