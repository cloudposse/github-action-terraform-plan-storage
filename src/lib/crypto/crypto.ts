import { createHash } from "node:crypto";

export const calculateHash = (plan: string) => {
  return createHash("sha256").update(plan).digest("hex");
};
