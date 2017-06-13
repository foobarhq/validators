import { numberValidator, InvalidData } from '../src';

describe('numberValidator', () => {

  test('parses numbers', () => {
    const validate = numberValidator();

    expect(validate('10')).toEqual(10);
    expect(validate('-10')).toEqual(-10);
    expect(validate('0')).toEqual(0);
    expect(validate('-0')).toEqual(-0);

    expect(validate('0xffffff')).toEqual(0xffffff);
    expect(validate('0b0101')).toEqual(0b0101);
    expect(validate('0.5')).toEqual(0.5);
  });

  test('rejects infinity by default', () => {
    const validate = numberValidator();

    expect(() => validate('Infinity')).toThrowError(InvalidData);
    expect(() => validate('-Infinity')).toThrowError(InvalidData);
  });

  test('can be configured to accept infinity', () => {
    const validate = numberValidator({ allowInfinite: true });

    expect(validate('Infinity')).toEqual(Number.POSITIVE_INFINITY);
    expect(validate('-Infinity')).toEqual(Number.NEGATIVE_INFINITY);
  });

  test('can be configured to only accept safe integers', () => {
    const validate = numberValidator({ integer: true });

    expect(validate('10')).toEqual(10);
    expect(validate('10.0')).toEqual(10);
    expect(() => validate('10.1')).toThrowError(InvalidData);

    // Max safe integer
    expect(validate('9007199254740991')).toEqual(Number.MAX_SAFE_INTEGER);

    // one above max safe integer
    expect(() => validate('9007199254740992')).toThrowError(InvalidData);

    // Min safe integer
    expect(validate('-9007199254740991')).toEqual(Number.MIN_SAFE_INTEGER);

    // one below min safe integer
    expect(() => validate('-9007199254740992')).toThrowError(InvalidData);
  });

  test('can be configured to only accept integers', () => {
    const validate = numberValidator({ integer: true });

    expect(validate('-10')).toEqual(-10);
    expect(validate('10')).toEqual(10);
    expect(validate('10.0')).toEqual(10);
    expect(() => validate('10.1')).toThrowError(InvalidData);
  });

  test('can be configured to only accept unsigned numbers', () => {
    const validate = numberValidator({ unsigned: true });

    expect(validate('10.1')).toEqual(10.1);
    expect(() => validate('-10.1')).toThrowError(InvalidData);
  });

  test('can be configured to only accept unsigned integers', () => {
    const validate = numberValidator({ unsigned: true, integer: true });

    expect(() => validate('-10.1')).toThrowError(InvalidData);
    expect(() => validate('10.1')).toThrowError(InvalidData);
    expect(() => validate('-10')).toThrowError(InvalidData);
    expect(validate('10')).toEqual(10);
  });

  test('can be configured to accept a range of numbers', () => {
    const validate = numberValidator({ min: 10, max: 15 });

    expect(validate('10')).toEqual(10);
    expect(validate('15')).toEqual(15);
    expect(() => validate('16')).toThrowError(InvalidData);
    expect(() => validate('9')).toThrowError(InvalidData);
  });
});
