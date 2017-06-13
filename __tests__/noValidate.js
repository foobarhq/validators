import { noValidate } from '../src';

describe('noValidate', () => {

  test('is the noop of validators', () => {
    const validate = noValidate();

    expect(validate(' true ')).toEqual(' true ');
    expect(validate(123)).toEqual(123);
    expect(validate(true)).toEqual(true);
    expect(validate([1, 2, 3])).toEqual([1, 2, 3]);
  });
});
