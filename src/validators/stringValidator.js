// @flow

import InvalidData from '../InvalidData';
import type { Validator } from '../types';
import optionalValidator from './optionalValidator';
import type { OptionalArgs } from './optionalValidator';

type StringValidatorArgs = {
  trim?: boolean | Function,
  minLength?: number,
  maxLength?: number,
  ...OptionalArgs,
};

const defaultStringValidatorArgs: StringValidatorArgs = {};
Object.freeze(defaultStringValidatorArgs);

export default function stringValidator(options: StringValidatorArgs = defaultStringValidatorArgs): Validator {

  const {
    trim = true,
    minLength = 0,
    maxLength = Number.POSITIVE_INFINITY,
  } = options;

  function validateString(item: string) {
    if (typeof item !== 'string') {
      throw new InvalidData('Not a string');
    }

    if (trim) {
      if (typeof trim === 'function') {
        item = trim(item);
      } else {
        item = item.trim();
      }
    }

    // $FlowFixMe
    if (minLength && item.length < minLength) {
      // $FlowFixMe
      throw new InvalidData(`Too small (min ${minLength} characters)`);
    }

    // $FlowFixMe
    if (maxLength && item.length > maxLength) {
      // $FlowFixMe
      throw new InvalidData(`Too large (max ${maxLength} characters)`);
    }

    return item;
  }

  return optionalValidator(validateString, options);
}
