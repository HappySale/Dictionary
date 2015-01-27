import assign from 'object-assign';
import runtime from './runtime';
import typeOf from './utils/type-of';
const { isString, isBoolean, isObject } = typeOf;
const { keys } = Object;


class Language {
  static concatTexts(context, preTemplates) {
    console.assert(isObject(context), 'context is not an object');
    console.assert(isObject(preTemplates), 'preTemplates is not a string');

    let newContext = assign({}, context);

    keys(preTemplates).forEach(function(key) {
      console.assert(! (key in this), 'concatTexts(): preTemplates template assign is override exist key');

      let preTemplate = preTemplates[key];

      console.assert((
        isString(preTemplate) ||
        (keys(preTemplate).every((k) => isString(preTemplate[k])))
      ), 'preTemplate is not a string or object of strings');

      this[key] = runtime[runtime.typeOf(preTemplate)](preTemplate);
    }, newContext);

    return newContext;
  }

  constructor(features) {
    const FEATURES = assign({
      recordTexts: false
    }, features);

    console.assert(isBoolean(FEATURES.recordTexts), 'recordTexts is not a boolean');

    this.RECORD_TEXTS = FEATURES.recordTexts;
    this.texts = {};
    this.components = {};

    if (this.RECORD_TEXTS) {
      this.preTexts = {};
      this.preComponents = {};
    }
  }

  /**
   * Saves preTemplates
   * @param  {Object of String or Object} from Pre templates before compilation
   * @param  {String} prefix                   Prefix if texts related to component
   *
   * @validation NOTE: asserts made in `concatTexts` and `add`
   */
  _record(from, prefix) {
    /** @type {Object of String or Object} The container of recorded pre templates */
    let to = (prefix ?
      (this.preComponents[prefix] || (this.preComponents[prefix] = {})) :
      this.preTexts
    );

    keys(from).forEach(function(tag) {
      let text = from[tag];

      switch(typeOf(text)) {
        case 'string':
          assign(to, { [tag]: text });
          break;

        case 'object':
          to[tag] = isObject(from[tag]) ? from[tag] : {};

          keys(text).forEach(function(to, from, tag) {
            let text = from[tag];

            if (isString(text)) {
              assign(to, { [tag]: text });
            }
          }.bind(this, to[tag], from[tag]));
          break;
      }
    });
  }

  add(preTemplates, prefix = '') {
    console.assert(isObject(preTemplates), 'preTemplates is not a string');
    console.assert(isString(prefix), 'prefix is not a string');

    /** Texts templates */
    if (prefix) {
      console.assert(! (prefix in this.components), 'prefix already assigned');

      this.components[prefix] = Language.concatTexts({}, preTemplates);
    } else {
      this.texts = Language.concatTexts(this.texts, preTemplates);
    }

    if (this.RECORD_TEXTS) {
      this._record(preTemplates, prefix);
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

  getRecords() {
    if (! this.RECORD_TEXTS) {
      return null;
    }

    return {
      texts: this.preTexts,
      components: this.preComponents
    };
  }
}


export default Language;
