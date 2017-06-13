// @flow

import type { Validator } from '../types';
import InvalidData from '../InvalidData';

export type OptionalArgs = {
  allowNull?: boolean,
  defaultValue?: any,
  threatAsVoid?: boolean,
};

const defaultOptionalArgs: OptionalArgs = {
  allowNull: false,
  defaultValue: void 0,
  threatAsVoid: false,
};

Object.freeze(defaultOptionalArgs);

export default function optionalValidator(
  validator: Validator,
  // $FlowFixMe
  { allowNull, defaultValue, threatAsVoid }: ?OptionalArgs = defaultOptionalArgs
): Validator {

  return function validateOptional(item, metadata) {
    if (item === null) {
      if (allowNull) {
        return null;
      }

      throw new InvalidData('Cannot be null');
    }

    if (
      item === void 0
      || (threatAsVoid && threatAsVoid === item)
      || (Array.isArray(threatAsVoid) && threatAsVoid.includes(item))
    ) {
      if (defaultValue === void 0) {
        throw new InvalidData('Missing value');
      }

      if (typeof defaultValue === 'function') {
        return defaultValue();
      }

      return defaultValue;
    }

    return validator(item, metadata);
  };
}

