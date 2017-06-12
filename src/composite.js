export function andValidator(validators: Array) {
  return function validateComposedAnd(item, metadata) {
    for (const validator of validators) {
      item = validator(item, metadata);
    }

    return item;
  };
}

export function orValidator(validators: Array) {
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
