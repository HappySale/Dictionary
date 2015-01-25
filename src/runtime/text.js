import template from '../template';
import PARAM_REGEX from '../constants/param-regex';
import { isString } from '../utils/type-of';

/**
 * Compile text to a template function
 * @param  {String} text        String that may contain parameters in string
 * @param  {RegExp} paramsRegex The regular expression to extract parameters
 *                              locations and names
 * @return {Function}           The template function
 */
export default function compileText(text, paramsRegex = PARAM_REGEX) {
  console.assert(isString(text), 'text isn\'t a string');

  const textsParams = text.split(paramsRegex);

  return function templateWrapper(...params) {
    /** @type {Array of String} Check if the first argument contains an array of
                                of string or the params themselves are the array
                                of string */
    const paramsObject = (params.length && ! isString(params[0]) ? params[0] : params);

    return template(textsParams, paramsObject);
  };
}
