import assign from 'object-assign';
import { isString, isBoolean, isNone } from './utils/type-of';
import DEFAULT_LANGUAGE from './constants/default-language';
import Language from './language';
const { keys } = Object;


class Dictionary {
  constructor(features) {
    const FEATURES = assign({
      language: 'en',
      recordTexts: false
    }, features);

    console.assert(isString(FEATURES.language), 'language is not a sting');
    console.assert(isBoolean(FEATURES.recordTexts), 'recordTexts is not a boolean');

    this.RECORD_TEXTS = FEATURES.recordTexts;
    this.languages = {};
    this.setCurrentLanguage(FEATURES.language);
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

    this.languages[languageCode] = new Language({ recordTexts: this.RECORD_TEXTS });
  }

  getLanguagesList() {
   return keys(this.languages);
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

  getRecords() {
    if (! this.RECORD_TEXTS) {
      return null;
    }

    let records = {};

    this.getLanguagesList().forEach(function(languageCode) {
      let langauge = this.getLanguage(languageCode);
      records[languageCode] = langauge.getRecords();
    }, this);

    return records;
  }
}


export default Dictionary;
