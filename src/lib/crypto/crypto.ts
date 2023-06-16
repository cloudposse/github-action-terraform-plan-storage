import { createHash } from "node:crypto";

export const calculateHash = (plan: string) => {
  return createHash("sha256").update(plan).digest("hex");
};

export const calculateHashFromBuffer = (plan: Buffer) => {
  return createHash("sha256").update(plan).digest("hex");
};
