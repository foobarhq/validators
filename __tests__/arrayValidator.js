// @flow

import { arrayValidator, InvalidData, numberValidator } from '../src';

describe('arrayValidator', () => {

  test('converts inputs to arrays by default', () => {
    const validate = arrayValidator();

    expect(validate([1, 2, 3])).toEqual([1, 2, 3]);
    expect(validate(1)).toEqual([1]);
  });

  test('can filter out duplicates', () => {
    const validate = arrayValidator({ unique: true });

    expect(validate([1, 2, 3, 1, 2])).toEqual([1, 2, 3]);
  });

  test('can require a minimum amount of items', () => {
    const validate = arrayValidator({ min: 10 });

    expect(() => validate([1, 2, 3, 1, 2])).toThrowError(InvalidData);
    expect(validate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('can require a maximum amount of items', () => {
    const validate = arrayValidator({ max: 10 });

    expect(validate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(() => validate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).toThrowError(InvalidData);
  });

  test('can accept an item validator as first argument', () => {
    const validate = arrayValidator(numberValidator({ integer: true }));

    expect(validate(['1', '2', '3'])).toEqual([1, 2, 3]);
  });

  test('can accept an item validator as second argument', () => {
    const validate = arrayValidator({}, numberValidator({ integer: true }));

    expect(validate(['1', '2', '3'])).toEqual([1, 2, 3]);
  });

  test('applies validation after converting the items', () => {
    const validate = arrayValidator({ unique: true, max: 1 }, numberValidator({ integer: true }));

    expect(validate(['0x0', '0b0', '0'])).toEqual([0]);
  });
});
