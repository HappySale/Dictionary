import { isString, isNone } from './utils/type-of';
import Language from './language';


class Dictionary {
  constructor(currentLanguage = 'en') {
    this.languages = {};

    this.setCurrentLanguage(currentLanguage);
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  setCurrentLanguage(currentLanguage) {
    console.assert(isString(currentLanguage), 'currentLanguage is not a string');
    console.assert(currentLanguage.length === 2, 'currentLanguage is not a supported code');

    if (isNone(this.getLanguage(currentLanguage))) {
      this.addLanguage(currentLanguage);
    }

    this.currentLanguage = currentLanguage;

    return currentLanguage;
  }

  getLanguage(lang) {
    if (! isString(lang)) {
      return this.languages[this.getCurrentLanguage()];
    }

    console.assert(lang.length === 2, 'lang is not a supported code');

    return this.languages[lang];
  }

  addLanguage(languageCode) {
    console.assert(! (languageCode in this.languages), `'${languageCode}' is already exists in languages`);

    this.languages[languageCode] = new Language(languageCode);
  }

  addTexts(preTemplates, prefix = '') {
    let activeDictionary = this.getLanguage();

    activeDictionary.add(preTemplates, prefix);

    return this;
  }

  t(text, prefix, ...params) {
    let activeDictionary = this.getLanguage(),
      template = activeDictionary.get(text, prefix);

    return template(params);
  }

  c(text, prefix, count, ...params) {
    let activeDictionary = this.getLanguage(),
      template = activeDictionary.get(text, prefix);

    return template(count, params);
  }

  /** Shortcut to `t` with no prefix */
  gt(text, ...params) {
    return this.t(text, '', ...params);
  }

  /** Shortcut to `c` with no prefix */
  gc(text, count, ...params) {
    return this.c(text, '', count, ...params);
  }

  /** For server side use to inject template functions */
  getShortcuts() {
    return {
      lang: this.setCurrentLanguage.bind(this),
      t: this.t.bind(this),
      c: this.c.bind(this),
      gt: this.gt.bind(this),
      gc: this.gc.bind(this)
    };
  }
}


export default Dictionary;
