import { Readable } from "stream";

export const stringFromReadable = async (
  readable: Readable
): Promise<string> => {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
};
