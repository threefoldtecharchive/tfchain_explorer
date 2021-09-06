import secondToRedable from "@/filters/secondToRedable";

describe("secondToRedable.ts", () => {
  it("Should parse time into a readable way by showing at most 2 values.", () => {
    // undefined or zero
    expect(secondToRedable()).toEqual("Unknown");
    expect(secondToRedable(0)).toEqual("0");

    // Seconds Tests
    expect(secondToRedable(1)).toEqual("1 Second");
    expect(secondToRedable(2)).toEqual("2 Seconds");

    // Mins Tests
    expect(secondToRedable(60)).toEqual("1 Min");
    expect(secondToRedable(120)).toEqual("2 Mins");

    // Hours Tests
    expect(secondToRedable(3600)).toEqual("1 Hour");
    expect(secondToRedable(3600 * 2)).toEqual("2 Hours");

    // Days Tests
    expect(secondToRedable(3600 * 24)).toEqual("1 Day");
    expect(secondToRedable(3600 * 24 * 2)).toEqual("2 Days");

    // Weeks Tests
    expect(secondToRedable(3600 * 24 * 7)).toEqual("1 Week");
    expect(secondToRedable(3600 * 24 * 7 * 2)).toEqual("2 Weeks");

    // Months Tests
    expect(secondToRedable(3600 * 24 * 30)).toEqual("1 Month");
    expect(secondToRedable(3600 * 24 * 30 * 2)).toEqual("2 Months");

    // Years Tests
    expect(secondToRedable(3600 * 24 * 365)).toEqual("1 Year");
    expect(secondToRedable(3600 * 24 * 365 * 2)).toEqual("2 Years");

    // Parsing Tests
    expect(secondToRedable(3600 * 24 * 365 * 2 + 1)).toEqual("2 Years, 1 Second"); // prettier-ignore
    expect(secondToRedable(3600 * 24 * 365 + 3600 * 24 * 7 * 3)).toEqual("1 Year, 3 Weeks"); // prettier-ignore
    expect(secondToRedable(3600 * 24 * 365 + 3600 * 24 * 7 * 3)).toEqual("1 Year, 3 Weeks"); // prettier-ignore
    expect(secondToRedable(3600 * 24 * 365 + 3600 * 24 * 30 * 2)).toEqual("1 Year, 2 Months"); // prettier-ignore

    /* Ingore seconds as its only focus on first two values */
    expect(secondToRedable(3600 * 24 * 365 + 3600 * 24 * 30 * 2 + 10)).toEqual("1 Year, 2 Months"); // prettier-ignore
  });
});
