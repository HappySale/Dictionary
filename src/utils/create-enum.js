import { isEmpty, isString } from './type-of';


export default function createEnum(...params) {
  console.assert(! isEmpty(params), 'params are empty');


  let obj = {};

  for (let param of params) {
    console.assert(isString(param), 'param is not a string');
    console.assert(! isEmpty(param), 'param is empty');

    obj[param] = param;
  }

  return obj;
}
