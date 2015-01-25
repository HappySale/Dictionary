import { isString, isObject, isEmpty } from './type-of';
// import countEnum from '../constants/' // for future deep checking


/**
 * Returns the type of the expected template comparing the object.
 * NOTE: right now there are only two types of templates (text, count)
 *       so there is no deep testing
 * NOTE: it also only detect structure, not the content. So it doesn't matter
 *       if it's a pre template or compiled one.
 *
 * @param  {Object or String} obj The text/s that supposed to be converted
 * @return {String}               The type of template
 */
export default function typeOfTemplate(obj) {
  console.assert(! isEmpty(obj), 'template cannot be empty');

  if (isString(obj)) {
    return 'text';
  }

  if (isObject(obj)) {
    return 'count';
  }

  throw new TypeError('Unknown type of template');
}
