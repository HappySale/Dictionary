/**
 * Get the type of variable.
 * based on Ember/Metal/Utils/typeOf
 *
 * @support ES5+
 */
import assign from 'object-assign';
import noop from './noop';
import objectToString from './object-to-string';
import nativeIsFinite from './native-is-finite';

/** @type {Array of String} Supported types detection */
const SUPPORTED_TYPES = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];
/** @type {Object of String} Map of types and to returned value from `Object.prototype.toString` */
const TYPE_MAP = SUPPORTED_TYPES
    .reduce((x, y) => assign(x, { [`[object ${y}]`]: y.toLowerCase() }), {});


export function isUndefined(x) {
  return x === undefined;
}

export function isNull(x) {
  return x === null;
}

export function isBoolean(x) {
  return x === true || x === false;
}

export function isArray(x) {
  return Array.isArray(x);
}

export function isObject(x) {
  return objectToString(x) === '[object Object]';
}

export function isFunction(x) {
  var uint8a = typeof Uint8Array !== 'undefined' ? Uint8Array : noop.create();

  return typeof x === 'function' && (! (x instanceof uint8a));
}

export function isDate(x) {
  // from https://github.com/lodash/lodash/blob/es6/lang/isDate.js
  return objectToString(x) === '[object Date]';
}

export function isNumber(x) {
  return (typeof x === 'number') || (objectToString(x) === '[object Number]');
}

export function isNaN(x) {
  if (Number.iNaN) {
    return Number.isNaN(x);
  }

  // based on: https://github.com/lodash/lodash/blob/es6/lang/isNaN.js
  return isNumber(x) && x !== Number(x);
}

export function isFinite(x) {
  if (Number.isFinite) {
    return Number.isFinite(x);
  }

  // based on: https://github.com/lodash/lodash/blob/es6/lang/isFinite.js
  return nativeIsFinite(x) && isNumber(x);
}

/** ES6 `isFinite` does the same thing */
export var isNumeric = isFinite;

export function isString(x) {
  return typeof x === 'string' || objectToString(x) === '[object String]';
}

export function isNone(x) {
  return isUndefined(x) || isNull(x);
}

export function isEmpty(x) {
  if (isNone(x)) {
    return true;
  }

  if (isNaN(x)) {
    return true;
  }

  if (isArray(x) && x.length === 0) {
    return true;
  }

  if (isObject(x) && Object.keys(x).length === 0) {
    return true;
  }

  if (isString(x) && x.length === 0) {
    return true;
  }

  return false;
}

export default function typeOf(x) {
  if (isUndefined(x)) {
    return 'undefined';
  }

  if (isNull(x)) {
    return 'null';
  }

  if (isFunction(x)) {
    return 'function';
  }

  /** @type {String} If didn't pass the custom tests */
  let type = objectToString(x);

  /** The fallback is always `object` */
  return (type in TYPE_MAP) ? TYPE_MAP[type] : 'object';
}
