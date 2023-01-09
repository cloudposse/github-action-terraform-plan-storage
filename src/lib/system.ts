import { readFileSync, writeFileSync } from "fs";

export const readFile = (path: string): string => {
  return readFileSync(path, "utf8");
};

export const writeFile = (path: string, contents: string): void => {
  writeFileSync(path, contents, "utf8");
};
