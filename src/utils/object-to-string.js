/**
 * Shortcut to `Object.prototype.toString.call`
 * @param  {Object} x
 * @return {String}   The type of object
 */
export default function ObjectToString(x) {
  return Object.prototype.toString.call(x);
}
