import { createHash } from "node:crypto";

export const calculateHash = (plan: Buffer) => {
  return createHash("sha256").update(plan).digest("hex");
};
