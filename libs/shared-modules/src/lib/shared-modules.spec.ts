import { sharedModules } from "./shared-modules";

describe("sharedModules", () => {
  it("should work", () => {
    expect(sharedModules()).toEqual("shared-modules");
  });
});
