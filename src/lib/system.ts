import { createWriteStream, readFileSync } from "fs";
import { Readable } from "stream";

export const readFile = (path: string): Buffer => {
  return readFileSync(path);
};

export const writeFile = (path: string, contents: Readable): void => {
  const outputStream = createWriteStream(path);
  contents.pipe(outputStream);
};
