import dateFiler from "@/filters/date";

describe("dateFilter.ts", () => {
  it("Should parse unix date correctly.", () => {
    const dateOfTesting = dateFiler(1630573665.501);
    expect(dateOfTesting).toEqual("9/2/21, 11:07 AM");
  });
});
