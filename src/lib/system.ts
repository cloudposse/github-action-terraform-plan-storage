import { readFileSync, writeFileSync } from "fs";

export const readFile = (path: string): Buffer => {
  return readFileSync(path);
};

export const writeFile = (path: string, contents: Uint8Array): void => {
  writeFileSync(path, contents);
};
