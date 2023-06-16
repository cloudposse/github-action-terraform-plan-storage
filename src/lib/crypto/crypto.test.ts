import { calculateHash } from "./crypto";

describe("crypto", () => {
  describe("calculateHash", () => {
    it("should calculate hash with string", () => {
      const hash = calculateHash("hello");
      expect(hash).toEqual(
        "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
      );
    });

    it("should calculate hash with buffer", () => {
      const hash = calculateHash(Buffer.from("hello"));
      expect(hash).toEqual(
        "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
      );
    });

    it("should calculate hash with Uint8Array", () => {
      const hash = calculateHash(new TextEncoder().encode("hello"));
      expect(hash).toEqual(
        "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
      );
    });
  });
});
