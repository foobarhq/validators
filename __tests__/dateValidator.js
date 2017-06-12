import { dateValidator, InvalidData } from '../src';

describe('dateValidator', () => {

  test('parses ISO 8601 datetime strings', () => {
    const validate = dateValidator();

    expect(validate('2011-10-05T14:48:00.000Z')).toEqual(new Date('2011-10-05T14:48:00.000Z'));
  });

  test('accepts dates', () => {
    const validate = dateValidator();

    expect(validate(new Date('2011-10-05T14:48:00.000Z'))).toEqual(new Date('2011-10-05T14:48:00.000Z'));
  });

  test('throws for invalid dates', () => {
    const validate = dateValidator();

    expect(() => validate('pomme')).toThrowError(InvalidData);
  });
});
