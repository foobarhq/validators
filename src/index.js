// @flow

import assert from 'assert';
import InvalidData from './InvalidData';
import { Validator } from './types';

export * from './composite';

export { default as arrayValidator } from './validators/arrayValidator';
export { default as booleanValidator } from './validators/booleanValidator';
export { default as dateValidator } from './validators/dateValidator';
export { default as enumValidator } from './validators/enumValidator';
export { default as noValidate } from './validators/noValidate';
export { default as numberValidator } from './validators/numberValidator';
export { default as optionalValidator } from './validators/optionalValidator';
export { default as stringValidator } from './validators/stringValidator';
export { default as structValidator } from './validators/structValidator';

export { InvalidData };

export function validate(item: any, itemName: string, validator: Validator, metadata?: any) {
  if (itemName === void 0 && validator === void 0 && typeof item === 'object' && item !== null) {
    const args = item;
    item = args.item;
    itemName = args.itemName;
    validator = args.validator;
    metadata = args.metadata;
  }

  assert(typeof validator === 'function', 'validator is not a function');

  try {
    return validator(item, metadata);
  } catch (e) {
    if (!(e instanceof InvalidData)) {
      throw e;
    }

    throw new TypeError(`${JSON.stringify(itemName)} validation failed: ${e.reason}`);
  }
}
