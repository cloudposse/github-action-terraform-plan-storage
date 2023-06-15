import { Readable } from "stream";

export const bufferFromReadable = async (
  readable: Readable
): Promise<Buffer> => {
  const buffers = [];
  for await (const data of readable) {
    buffers.push(data);
  }

  const finalBuffer = Buffer.concat(buffers);
  return finalBuffer;
};
