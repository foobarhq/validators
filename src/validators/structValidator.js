import type { Validator } from '../types';
import InvalidData from '../InvalidData';
import optionalValidator, { type OptionalArgs } from './optionalValidator';

export default function structValidator(validators: { [key: string]: Validator }, options: ?OptionalArgs): Validator {

  if (!validators || typeof validators !== 'object') {
    throw new TypeError('missing struct component validators');
  }

  const validatorKeys = Object.getOwnPropertyNames(validators);
  Object.freeze(validatorKeys);

  function validateStruct(item, metadata) {
    if (item === null || typeof item !== 'object') {
      throw new InvalidData('Not an object');
    }

    for (const key of validatorKeys) {
      const validator = validators[key];
      const value = item[key];

      try {
        item[key] = validator(value, metadata);
      } catch (e) {
        if (!(e instanceof InvalidData)) {
          throw e;
        }

        e.reason = `Invalid property ${JSON.stringify(key)} (val: ${JSON.stringify(value)}): ${e.reason}`;
        if (!e.key) {
          e.key = key;
        }

        throw e;
      }
    }

    const itemKeys = Object.getOwnPropertyNames(item).filter(key => !validators[key]);
    if (itemKeys.length > 0) {
      throw new InvalidData(`Extraneous properties: ${itemKeys.map(JSON.stringify).join(', ')}`);
    }

    return item;
  }

  return optionalValidator(validateStruct, options);
}
