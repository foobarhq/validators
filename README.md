# @foobarhq/validators

This package is deprecated, please use https://www.npmjs.com/package/joi

---

[![npm version](https://badge.fury.io/js/%40foobarhq%2Fvalidators.svg)](https://badge.fury.io/js/%40foobarhq%2Fvalidators)

The main purpose of this library is (but not limited) to parse and validate data received from HTTP requests.

It achieves this goal by providing a set of composable functions designed to easily build complex input validators.

## Usage

Install from NPM: `npm install @foobarhq/validators`

```javascript
import { numberValidator } from '@foobarhq/validators';

// create a new validator
const validate = numberValidator();

// use the validator
validate('0xff'); // 255
validate('123');  // 123 (number)
validate(12);     // 12

validate('foo'); // throws InvalidData Error
```

## Validators

### stringValidator

Validates strings. It only accepts strings as inputs.

```javascript
import { stringValidator } from '@foobarhq/validators';

// these are the default options.
const validate = stringValidator({
  // can be either true or 'both' to use String.prototype.trim,
  // 'start' for String.prototype.trimStart
  // 'end' for String.prototype.trimEnd
  // false for no trimming,
  // or a function with the following signature: (string) => string
  trim: true,
  minLength: 0,
  maxLength: Number.POSITIVE_INFINITY,

  // wether the input can be null.
  allowNull: false,

  // the value to return if the input is undefined.
  defaultValue: undefined,
});

validate(' 123 '); // 123
```

### numberValidator

Validates numbers. It accepts strings and numbers as inputs.

```javascript
import { numberValidator } from '@foobarhq/validators';

// these are the default options.
const validate = numberValidator({

  // refuse numbers < 0
  unsigned: false,

  // refuse non safe integers and floats
  integer: false,

  // accept Infinity and -Infinity
  allowInfinite: false,

  // minimum value for the input
  min: -Infinity,

  // maximum value for the input
  max: +Infinity,

  allowNull: false,
  defaultValue: undefined,
});

validate('Infinity'); // throws
validate('-Infinity'); // throws
validate('10.5'); // 10.5
validate(456); // 456
```

### booleanValidator

Parses booleans. It accepts strings and booleans as inputs.

```javascript
import { booleanValidator } from '@foobarhq/validators';

// these are the default options.
const validate = booleanValidator({
  allowNull: false,
  defaultValue: undefined,
});

validate('t'); // true
validate('f'); // false
validate('true'); // true
validate(false); // false
```

### dateValidator

Parses dates. It accepts strings and native Date objects as inputs.

```javascript
import { dateValidator } from '@foobarhq/validators';

// these are the default options.
const validate = dateValidator({
  allowNull: false,
  defaultValue: undefined,
});

validate('2011-10-05T14:48:00.000Z'); // new Date object
validate(new Date('2011-10-05T14:48:00.000Z')); // the date object
validate('true'); // throws
```

### enumValidator

Restricts its input to a set of values.

```javascript
import { enumValidator } from '@foobarhq/validators';

// these are the default options.
// with an array of values:
const validate = enumValidator([1, 2, 3], {
  allowNull: false,
  defaultValue: undefined,
});

validate(1); // 1
validate(3); // 3
validate(4); // throws

// with an object:
const validate = enumValidator({
  ITEM_1: 1,
  ITEM_2: 'banana',
});

validate(1); // throws
validate('ITEM_1'); // 1
validate('ITEM_2'); // banana
```

### noValidate

The noop of validators, doesn't parse, doesn't validate, just returns its input.

```javascript
import { noValidate } from '@foobarhq/validators';

// no option available
const validate = noValidate();

validate(1); // 1
validate(3); // 3
validate(' 1_2_3 '); // ' 1_2_3 '
```

### arrayValidator

A composable validator which validates an array and its items.

```javascript
import { arrayValidator, numberValidator } from '@foobarhq/validators';

// these are the default options.
// without an item validator
const validate = arrayValidator({
  allowNull: false,
  defaultValue: undefined,

  // minimum amount of items in the array.
  min: 0,

  // maximum amount of items in the array.
  max: Number.POSITIVE_INFINITY,

  // in strict mode, throws if the input is not an array. Otherwise, wraps the input in a new array.
  strict: false,

  // remove any duplicate from the array
  unique: false,
});

validate(1); // [1]
validate([1, 2, 3]); // [1, 2, 3]

// with an item validator:
const validate = arrayValidator(numberValidator(), {
  strict: true,
});

validate(1); // throws
validate(['0x00', '0b0', '0', 0]); // [0, 0, 0, 0]
```

### structValidator

Validates an object structure. Accepts simple objects as inputs.

```javascript
import { structValidator, numberValidator } from '@foobarhq/validators';

// these are the default options.
const validate = structValidator({
  item1: numberValidator(),
}, {
  allowNull: false,
  defaultValue: undefined,
});

validate({}); // throws
validate({ item1: '10' }) // { item1: 5 }

// the options of used validators still apply
const validate = structValidator({
  item1: numberValidator({ defaultValue: 10 }),
}, {
  allowNull: false,
  defaultValue: undefined,
});

validate({}); // { item1: 10 }
validate({ item1: '5' }) // { item1: 5 }
```
