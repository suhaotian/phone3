import { setupData, getData, validate } from '../src';
import { allData } from '../src/allData';

describe('blah', () => {
  it('works', () => {
    expect(getData().length).toEqual(0);
  });
  it('setupData works', () => {
    setupData(allData);
    expect(getData().length > 0).toBe(true);
  });
  it('validate works', () => {
    setupData(allData);
    expect(validate('(817) 569-8900').length).toBe(2);
    expect(validate('8175698900').length).toBe(2);
  });
});
