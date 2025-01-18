import { join } from "path";
import { readFile } from "fs/promises";
import { createOpenSCAD } from "../dist/openscad.js";
import { loadTestFiles } from "./testing";

const exampleDir = "../libs/openscad/examples/";
const sets = ["Basics", "Advanced", "Parametric"];
const exclude = ["Advanced: module_recursion.scad"];

describe("OpenSCAD Examples", () => {
  let examples: Record<string, string[]>;

  beforeAll(async () => {
    examples = JSON.parse(
      await readFile(join(exampleDir, "examples.json"), "utf8")
    );
  });

  for (const set of sets) {
    describe(set, () => {
      for (const file of examples[set] || []) {
        const name = `${set}: ${file}`;
        if (exclude.includes(name)) continue;

        it(file, async () => {
          await runTest(file, join(exampleDir, set));
        });
      }
    });
  }
});

async function runTest(entrypoint: string, directory: string) {
  const openscad = await createOpenSCAD({ noInitialRun: true });
  const instance = openscad.getInstance();

  await loadTestFiles(instance, directory);

  const code = instance.callMain([
    entrypoint,
    "--enable=roof",
    "-o",
    "out.stl",
  ]);
  expect(code).toBe(0);
}
