import assign from 'object-assign';
import runtime from './runtime';
import { isString, isObject } from './utils/type-of';
const { keys } = Object;


class Language {
  static concatTexts(context, preTemplates) {
    console.assert(isObject(context), 'context is not an object');
    console.assert(isObject(preTemplates), 'preTemplates is not a string');

    let newContext = assign({}, context);

    keys(preTemplates).forEach(function(key) {
      console.assert(! (key in this), 'concatTexts(): preTemplates template assign is override exist key');

      let preTemplate = preTemplates[key];

      this[key] = runtime[runtime.typeOf(preTemplate)](preTemplate);
    }, newContext);

    return newContext;
  }

  constructor() {
    this.texts = {};
    this.components = {};
  }

  add(preTemplates, prefix = '') {
    console.assert(isObject(preTemplates), 'preTemplates is not a string');
    console.assert(isString(prefix), 'prefix is not a string');

    /** Texts templates */
    if (prefix) {
      console.assert(! (prefix in this.components), 'prefix already assigned');

      this.components[prefix] = Language.concatTexts(this.texts, preTemplates);
    } else {
      this.texts = Language.concatTexts(this.texts, preTemplates);
    }
  }

  /** @todo modify() */

  get(text, prefix = '') {
    console.assert(isString(text), 'text is not a string');
    console.assert(text.length > 0, 'text is empty');
    console.assert(isString(prefix), 'prefix is not a string');

    if (prefix.length > 0) {
      console.assert(prefix in this.components, 'prefix is not in this.components');
      console.assert(text in this.components[prefix], 'text is in not in this.components.prefix');

      return this.components[prefix][text];
    } else {
      console.assert(text in this.texts, `'${text}' is in not in this.texts`);

      return this.texts[text];
    }
  }
}


export default Language;
