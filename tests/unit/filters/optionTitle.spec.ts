import optionTitleFiler from "@/filters/optionTitle";

describe("optionTitle.ts", () => {
  it("Should parse titles which inlcude capital letters.", () => {
    const t1 = optionTitleFiler("HelloWorld");
    expect(t1).toEqual(" Hello World");

    const t2 = optionTitleFiler("helloworld");
    expect(t2).toEqual("helloworld");

    const t3 = optionTitleFiler("helloWorld");
    expect(t3).toEqual("hello World");

    const t4 = optionTitleFiler("hELLO");
    expect(t4).toEqual("h E L L O");
  });
});
