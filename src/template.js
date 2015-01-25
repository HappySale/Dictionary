import { isArray, isObject, isString } from './utils/type-of';

/**
 * Takes array of texts and properties names' and parameters and returns a text
 * @param  {Array of String} textsParams Array of texts and parameters names
 *                                       it construct in a way of:
 *                                       - even indexes are plain text as is
 *                                       - odd indexes are key name in params
 * @param  {Object of String} params     The parameters values
 * @return {String}                      The text
 */
export default function template(textsParams, params = {}) {
  console.assert(isArray(textsParams), 'textsParams isn\'t an array');
  console.assert(textsParams.every(isString), 'textsParams isn\'t an array of strings');
  console.assert(isArray(params) || isObject(params), 'params isn\'t an array or object');


  return textsParams.map((key, index) => {
    /** If key is a plain text. (even indexes) */
    if (index % 2 === 0) {
      return key;
    }

    /** If key is for property name. (odd indexes) */
    console.assert(key !== '', `textsParams[${index}] is an empty string`);

    return key in params ? params[key] : '';
  }).join('');
}
