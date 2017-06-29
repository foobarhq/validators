// @flow

import type { Validator } from '../types';
import InvalidData from '../InvalidData';

export type OptionalArgs = {
  allowNull?: boolean,
  defaultValue?: any,
  threatAsVoid?: any,
};

const defaultOptionalArgs: OptionalArgs = {
  allowNull: false,
};

Object.freeze(defaultOptionalArgs);

export default function optionalValidator(
  validator: Validator,
  // $FlowFixMe
  options?: OptionalArgs = defaultOptionalArgs
): Validator {

  return function validateOptional(item, metadata) {
    if (item === null) {
      if (options.allowNull) {
        return null;
      }

      throw new InvalidData('Cannot be null');
    }

    if (
      item === void 0
      || (options.threatAsVoid && options.threatAsVoid === item)
      || (Array.isArray(options.threatAsVoid) && options.threatAsVoid.includes(item))
    ) {
      if (!Object.prototype.hasOwnProperty.call(options, 'defaultValue')) {
        throw new InvalidData('Missing value');
      }

      if (typeof options.defaultValue === 'function') {
        return options.defaultValue();
      }

      return options.defaultValue;
    }

    return validator(item, metadata);
  };
}

