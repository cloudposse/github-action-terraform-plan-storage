import { calculateHash } from "./crypto";

describe("crypto", () => {
  describe("createHash", () => {
    it("should calculate hash", () => {
      const hash = calculateHash("hello");
      expect(hash).toEqual(
        "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
      );
    });
  });
});
