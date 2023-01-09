import { readFile } from "./system";

describe("system", () => {
  describe("readFile", () => {
    it("should read a file", () => {
      const path = "src/__fixtures__/mockfile.txt";
      const content = readFile(path);

      expect(content).toEqual(
        "This is a test of the emergency broadcast system. This is only a test. (upbeat music)\n"
      );
    });
  });
});
