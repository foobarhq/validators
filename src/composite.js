// @flow

import type { Validator } from './types';

export function andValidator(validators: Validator[]): Validator {
  return function validateComposedAnd(item, metadata) {
    for (const validator of validators) {
      item = validator(item, metadata);
    }

    return item;
  };
}

export function orValidator(validators: Validator[]): Validator {
  return function validateComposedOr(item, metadata) {

    let lastError = null;

    for (const validator of validators) {
      try {
        return validator(item, metadata);
      } catch (e) {
        lastError = e;
      }
    }

    throw lastError;
  };
}
