import { stringValidator, InvalidData } from '../src';

describe('stringValidator', () => {

  test('trims by default', () => {
    const validate = stringValidator();

    expect(validate(' hello ? ')).toEqual('hello ?');
  });

  test('throws for non-string values', () => {
    const validate = stringValidator();

    expect(() => validate(123)).toThrowError(InvalidData);
  });

  test('can disable trimming', () => {
    const validate = stringValidator({ trim: false });

    expect(validate(' hello ? ')).toEqual(' hello ? ');
  });

  test('can set a min length', () => {
    const validate = stringValidator({ minLength: 5 });

    expect(validate('12345')).toEqual('12345');
    expect(() => validate('1234')).toThrowError(InvalidData);
  });

  test('can set a max length', () => {
    const validate = stringValidator({ maxLength: 5 });

    expect(validate('12345')).toEqual('12345');
    expect(() => validate('123456')).toThrowError(InvalidData);
  });
});
