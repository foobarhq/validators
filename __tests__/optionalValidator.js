// @flow

import { noValidate, optionalValidator, InvalidData } from '../src';

describe('optionalValidator', () => {

  test('refuses null by default', () => {
    const validate = optionalValidator(noValidate());

    expect(() => validate(null)).toThrowError(InvalidData);
  });

  test('can be configured to accept null', () => {
    const validate = optionalValidator(noValidate(), { allowNull: true });

    expect(validate(null)).toEqual(null);
  });

  test('refuses undefined by default', () => {
    const validate = optionalValidator(noValidate());

    expect(() => validate(void 0)).toThrowError(InvalidData);
  });

  test('can accept a defaultValue as a replacement for undefined', () => {
    const validate = optionalValidator(noValidate(), { defaultValue: 'yes' });

    expect(validate(void 0)).toEqual('yes');
  });

  test('can accept a null as a defaultValue', () => {
    const validate = optionalValidator(noValidate(), { defaultValue: null });

    expect(validate(void 0)).toEqual(null);
  });
});
