import { createHash } from "node:crypto";

export const calculateHash = (plan: string | Buffer | Uint8Array) => {
  return createHash("sha256").update(plan).digest("hex");
};
