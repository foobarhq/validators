import assert from 'assert';

export * from './composite';
export * from './validators';

export class InvalidData {
  key: ?string;
  reason: string;

  constructor(reason, key) {
    this.reason = reason;
    this.key = key;
  }
}

export function validate(item, itemName, validator, metadata) {
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

    // const key = e.key || itemName;

    throw new TypeError(`${JSON.stringify(itemName)} validation failed: ${e.reason}`);
  }
}
