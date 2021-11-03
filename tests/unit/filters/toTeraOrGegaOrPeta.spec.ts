import toTeraOrGigaOrPeta from "@/filters/toTeraOrGigaOrPeta";

describe("toTeraOrGigaOrPeta.ts", () => {
  it("Should parse passed amount of bytes into GB or TB depending on the amount.", () => {
    const t1 = toTeraOrGigaOrPeta("879879465465");
    expect(t1).toEqual("879.88 GB");

    const t2 = toTeraOrGigaOrPeta("879879465465123");
    expect(t2).toEqual("879.88 TB");

    const t3 = toTeraOrGigaOrPeta("879879465465123123");
    expect(t3).toEqual("879.88 PB");
  });
});
