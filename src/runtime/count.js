import assign from 'object-assign';
import template from '../template';
import COUNT_KEYS from '../constants/compile-count-keys';
import PARAM_REGEX from '../constants/param-regex';
import { isObject, isString, isNumeric, isEmpty } from '../utils/type-of';
const { keys } = Object;

/**
 * Compile text with a parameter of amount to a template function
 * @param  {String} text        String that may contain parameters inside the string
 * @param  {RegExp} paramsRegex The regular expression to extract parameters
 *                              locations and names
 * @return {Function}           The template function
 */
export default function compileCount(texts, paramsRegex = PARAM_REGEX) {
  console.assert(isObject(texts), 'texts isn\'t an object');
  console.assert(! isEmpty(texts), 'texts is an empty object');
  console.assert(keys(texts).every(key => isString(texts[key])), 'texts contains none string object');

  const textsParamsObject =
    /** Takes out the keys for iteration */
    keys(texts)
    /** Creates textsParams for each key */
    .map(key => [ key, texts[key].split(paramsRegex) ])
    /** Convert the array back to object */
    .reduce((obj, array) => assign(obj, { [ array[0] ]: array[1] }), {});


  return function templateWrapper(count, ...params) {
    console.assert(isNumeric(count), 'texts isn\'t a number');

    /** @type {Array of String} Check if the first argument contains an array of
                                of string or the params themselves are the array
                                of string */
    const paramsObject = (params.length && ! isString(params[0]) ? params[0] : params);
    /** @type {Object of String} The object of params with the count property */
    const paramsObjectWithCount = assign({}, paramsObject, { count: count });


    /** NONE */
    if (count === 0 && (COUNT_KEYS.none in textsParamsObject)) {
      return template(textsParamsObject.none, paramsObjectWithCount);
    /** SINGLE */
    } else if (count === 1 && (COUNT_KEYS.single in textsParamsObject)) {
      return template(textsParamsObject.single, paramsObjectWithCount);
    /** OTHER */
    } else if (COUNT_KEYS.other in textsParamsObject) {
      return template(textsParamsObject.other, paramsObjectWithCount);
    }


    console.warn('There is no match textsParams to the count');

    return '';
  };
}
