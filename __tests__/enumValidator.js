// @flow

import { enumValidator, InvalidData } from '../src';

describe('enumValidator', () => {

  test('restricts input to a set of values (array)', () => {
    const aEnum = [1, 2, 3];

    const validate = enumValidator(aEnum);

    expect(validate(2)).toEqual(2);
    expect(() => validate(4)).toThrowError(InvalidData);
  });

  test('restricts input to a set of values and map them (object)', () => {
    const aEnum = {
      ITEM_1: 1,
      ITEM_2: 2,
      ITEM_3: 3,
    };

    const validate = enumValidator(aEnum);

    expect(validate('ITEM_2')).toEqual(2);
    expect(() => validate('something else')).toThrowError(InvalidData);
  });

  test('is case sensitive', () => {
    const aEnum = {
      ITEM_1: 1,
      ITEM_2: 2,
      ITEM_3: 3,
    };

    const validate = enumValidator(aEnum);
    expect(() => validate('item_2')).toThrowError(InvalidData);
  });
});
