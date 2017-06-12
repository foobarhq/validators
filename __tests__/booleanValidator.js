import { booleanValidator, InvalidData } from '../src';

describe('booleanValidator', () => {

  test('parses "true" as true', () => {
    const validate = booleanValidator();

    expect(validate('true')).toEqual(true);
  });

  test('parses "t" as true', () => {
    const validate = booleanValidator();

    expect(validate('t')).toEqual(true);
  });

  test('parses "false" as false', () => {
    const validate = booleanValidator();

    expect(validate('false')).toEqual(false);
  });

  test('parses "f" as false', () => {
    const validate = booleanValidator();

    expect(validate('f')).toEqual(false);
  });

  test('parses booleans as themselves', () => {
    const validate = booleanValidator();

    expect(validate(true)).toEqual(true);
    expect(validate(false)).toEqual(false);
  });

  test('throws for any other value', () => {
    const validate = booleanValidator();

    expect(() => validate('0')).toThrowError(InvalidData);
    expect(() => validate('1')).toThrowError(InvalidData);
  });
});
