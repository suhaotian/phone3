import { setupData, getData, validate } from "../src";
import { allData } from "../src/allData";
import America from "../src/iso3166Data/1_USA";
import China from "../src/iso3166Data/86_CHN";
import Turkey from "../src/iso3166Data/90_TUR";

describe("blah", () => {
  it("works", () => {
    expect(getData().length).toEqual(0);
  });
  it("setupData works", () => {
    setupData(allData);
    expect(getData().length > 0).toBe(true);
  });
  it("validate works", () => {
    setupData(allData);
    expect(validate("(817) 569-8900").length).toBe(2);
    expect(validate("8175698900").length).toBe(2);
  });
  it("partial countris should works", () => {
    setupData([]);
    expect(getData().length).toEqual(0);
    setupData([America, China, Turkey]);
    expect(getData().length).toEqual(3);
  });
});
