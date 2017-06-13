import { InvalidData } from './index';

export function optionalValidator(validator, { allowNull, defaultValue, threatAsVoid } = {}) {
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

export function enumValidator(values: Array
  | Object, options) {

  let map = null;
  if (!Array.isArray(values)) {
    map = values;
    values = Object.keys(values);
  }

  function validateEnum(item) {

    if (!values.includes(item)) {
      throw new InvalidData(`Item not in enum [${values.join(', ')}]`);
    }

    if (map) {
      return map[item];
    }

    return item;
  }

  return optionalValidator(validateEnum, options);
}

export function structValidator(validators, options) {

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

function noop(arg) {
  return arg;
}

export function noValidate() {
  return noop;
}

export function booleanValidator(config) {

  function validateBoolean(item) {
    if (typeof item === 'boolean') {
      return item;
    }

    if (typeof item === 'string') {
      if (item === 'true' || item === 't') {
        return true;
      }

      if (item === 'false' || item === 'f') {
        return false;
      }
    }

    throw new InvalidData('Not a boolean (true/false).');
  }

  return optionalValidator(validateBoolean, config);
}

export function dateValidator(config) {
  return optionalValidator(validateDate, config);
}

function validateDate(item) {
  if (item instanceof Date) {
    return item;
  }

  const timestamp = Date.parse(item);
  if (Number.isNaN(timestamp)) {
    throw new InvalidData('Not a date');
  }

  return new Date(timestamp);
}

export function numberValidator(options: {
  unsigned: boolean,
  integer: boolean,
  allowInfinite: boolean,
  min: number,
  max: number,
  allowNull: boolean,
  defaultValue: any,
} = {}) {

  const {
    unsigned = false,
    integer = false,
    allowInfinite = false,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
  } = options;

  function validateNumber(item) {
    const type = typeof item;
    if (type !== 'string' && type !== 'number') {
      throw new InvalidData('Not a valid number format');
    }

    item = Number(item);
    if (Number.isNaN(item)) {
      throw new InvalidData('Not a valid number format');
    }

    if (unsigned && item < 0) {
      throw new InvalidData('Must be unsigned');
    }

    if (!Number.isFinite(item)) {
      if (allowInfinite) {
        return item;
      }

      throw new InvalidData('Must be a finite number');
    }

    if (integer && !Number.isSafeInteger(item)) {
      throw new InvalidData('Must be a representable integer');
    }

    if (item < min) {
      throw new InvalidData(`Below the minimum value of ${min}`);
    }

    if (item > max) {
      throw new InvalidData(`Above the maximum value of ${max}`);
    }

    return item;
  }

  return optionalValidator(validateNumber, options);
}

export function stringValidator(options: {
  trim: boolean | Function,
  minLength: number,
  maxLength: number,
  allowNull: boolean,
  defaultValue: any,
} = {}) {

  const {
    trim = true,
    minLength = 0,
    maxLength = Number.POSITIVE_INFINITY,
  } = options;

  function validateString(item) {
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

    if (minLength && item.length < minLength) {
      throw new InvalidData(`Too small (min ${minLength} characters)`);
    }

    if (maxLength && item.length > maxLength) {
      throw new InvalidData(`Too large (max ${maxLength} characters)`);
    }

    return item;
  }

  return optionalValidator(validateString, options);
}

export function arrayValidator(itemValidator: Function, options: {
  unique: boolean,
  min: number,
  max: number,
  allowNull: boolean,
  defaultValue: any,
}) {

  function validateArray(items, metadata) {

    if (!Array.isArray(items)) {
      items = [items];
    }

    let resultingArray = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item === void 0) {
        continue;
      }

      try {
        resultingArray.push(itemValidator(item, metadata));
      } catch (e) {
        if (!(e instanceof InvalidData)) {
          throw e;
        }

        e.reason = `Invalid value for array entry ${i} (val: ${JSON.stringify(item)}): ${e.reason}`;

        throw e;
      }
    }

    if (options) {
      if (options.unique) {
        resultingArray = resultingArray.filter(onlyUnique);
      }

      if (options.min !== void 0 && resultingArray.length < options.min) {
        throw new InvalidData(`Too few items (min ${options.min} items)`);
      }

      if (options.max !== void 0 && resultingArray.length > options.max) {
        throw new InvalidData(`Too many items (max ${options.max} items)`);
      }
    }

    return resultingArray;
  }

  return optionalValidator(validateArray, options);
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
