import { join, dirname } from "path";
import { readFile, readdir } from "fs/promises";
import type { OpenSCAD } from "../dist/openscad.js";

export async function loadTestFiles(instance: OpenSCAD, directory: string) {
  const fileMap = new Map<string, string>();
  await readFiles(fileMap, directory, ".");

  for (const [from, to] of fileMap) {
    const content = await readFile(from);
    ensureDirExists(instance.FS, dirname(to));
    instance.FS.writeFile(to, content);
  }
}

function ensureDirExists(fs: OpenSCAD["FS"], path: string) {
  try {
    fs.stat(path);
  } catch (e: unknown) {
    ensureDirExists(fs, dirname(path));
    fs.mkdir(path);
  }
}

async function readFiles(
  map: Map<string, string>,
  root: string,
  location: string
) {
  const cwd = join(root, location);
  const entries = await readdir(cwd, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await readFiles(map, root, join(location, entry.name));
    } else {
      map.set(join(cwd, entry.name), join("/", location, entry.name));
    }
  }
}
