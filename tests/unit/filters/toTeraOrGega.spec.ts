import toTeraOrGiga from "@/filters/toTeraOrGiga";

describe("toTeraOrGiga.ts", () => {
  it("Should parse passed amount of bytes into GB or TB depending on the amount.", () => {
    const t1 = toTeraOrGiga("879879465465");
    expect(t1).toEqual("879.88 GB");

    const t2 = toTeraOrGiga("879879465465123");
    expect(t2).toEqual("879.88 TB");
  });
});
