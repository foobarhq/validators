import { booleanValidator, stringValidator, andValidator, InvalidData } from '../src';

describe('andValidator', () => {

  test('passes if all of its validators pass', () => {
    const validate = andValidator([
      stringValidator({ trim: true }),
      booleanValidator(),
    ]);

    // string validator will trim and boolean validator will parse
    expect(validate(' true ')).toEqual(true);
  });

  test('rejects if any of its validators reject', () => {
    const validate = andValidator([
      stringValidator({ trim: true }),
      booleanValidator(),
    ]);

    // string validator will reject
    expect(() => validate(true)).toThrowError(InvalidData);
  });
});
