import { numberValidator, structValidator, InvalidData } from '../src';

describe('structValidator', () => {

  test('validates object structures', () => {
    const validate = structValidator({});

    expect(validate({})).toEqual({});
  });

  test('rejects redundant object properties', () => {
    const validate = structValidator({});

    expect(() => validate({ item: 2 })).toThrowError(InvalidData);
  });

  test('rejects if a property is missing', () => {
    const validate = structValidator({
      item: numberValidator(),
    });

    expect(() => validate({})).toThrowError(InvalidData);
    expect(validate({ item: 5 })).toEqual({ item: 5 });
  });

  test('doesn\'t reject if a missing property is optional', () => {
    const validate = structValidator({
      item: numberValidator({ defaultValue: 10 }),
    });

    expect(validate({ item: 5 })).toEqual({ item: 5 });
    expect(validate({})).toEqual({ item: 10 });
  });
});
