import { booleanValidator, stringValidator, orValidator, numberValidator, InvalidData } from '../src';

describe('orValidator', () => {

  test('passes if any of its validators pass', () => {
    const validate = orValidator([
      numberValidator(),
      booleanValidator(),
    ]);

    // number validator will reject, but boolean validator will pass.
    expect(validate('true')).toEqual(true);
  });

  test('rejects if all of its validators reject', () => {
    const validate = orValidator([
      stringValidator(),
      numberValidator(),
    ]);

    // both string validator and number validator will reject
    expect(() => validate(true)).toThrowError(InvalidData);
  });
});
