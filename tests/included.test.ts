import { join } from "path";
import { writeFile } from "fs/promises";
import { createOpenSCAD } from "../dist/openscad.js";
import { loadTestFiles } from "./testing";

describe("OpenSCAD Tests", () => {
  it("csg", async () => {
    await runTest("csg");
  });

  it("cube", async () => {
    await runTest("cube");
  });

  it("cylinder", async () => {
    await runTest("cylinder");
  });

  it("lib", async () => {
    await runTest("lib");
  });

  it("text", async () => {
    await runTest("text");
  });

  it("print stderr", async () => {
    let stderr = "";
    const openscad = await createOpenSCAD({
      noInitialRun: true,
      printErr: (text) => (stderr += text + "\n"),
    });

    const instance = openscad.getInstance();
    instance.callMain(["--help"]);
    expect(stderr).toContain("Usage:");
  });

  it("print stdout", async () => {
    let stdout = "";
    const openscad = await createOpenSCAD({
      noInitialRun: true,
      print: (text) => (stdout += text + "\n"),
    });

    const instance = openscad.getInstance();
    instance.callMain(["--help"]);
    expect(stdout).toContain("Usage:");
  });
});

async function runTest(directory: string) {
  const openscad = await createOpenSCAD({ noInitialRun: true });
  const instance = openscad.getInstance();

  await loadTestFiles(instance, join(__dirname, directory));

  const code = instance.callMain(["test.scad", "-o", "out.stl"]);
  expect(code).toBe(0);

  const output = instance.FS.readFile("out.stl");
  await writeFile(join(__dirname, directory, "out.stl"), output);
}
