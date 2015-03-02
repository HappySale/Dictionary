!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Dictionary=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assign = _interopRequire(require("object-assign"));

var DEFAULT_LANGUAGE = _interopRequire(require("./constants/default-language"));

var _utilsTypeOf = require("./utils/type-of");

var isString = _utilsTypeOf.isString;
var isBoolean = _utilsTypeOf.isBoolean;
var isObject = _utilsTypeOf.isObject;
var isNone = _utilsTypeOf.isNone;

var Language = _interopRequire(require("./language"));

var keys = Object.keys;

var Dictionary = (function () {
  function Dictionary() {
    var features = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Dictionary);

    console.assert(isObject(features), "features is not an object");

    var RECORDS = features.records;
    var LANGUAGE = isObject(RECORDS) && keys(RECORDS).indexOf(DEFAULT_LANGUAGE) === -1 ? keys(RECORDS)[0] : DEFAULT_LANGUAGE;
    var FEATURES = assign({
      language: LANGUAGE,
      recordTexts: false,
      records: RECORDS || null
    }, features);

    console.assert(isString(FEATURES.language), "language is not a sting");
    console.assert(isBoolean(FEATURES.recordTexts), "recordTexts is not a boolean");
    console.assert(isNone(FEATURES.records) || isObject(FEATURES.records), "records is not an object or a null");

    this.RECORD_TEXTS = FEATURES.recordTexts;
    this.languages = {};
    this.setCurrentLanguage(FEATURES.language);

    if (FEATURES.records) {
      this._initializeRecords(FEATURES.records);
    }
  }

  _prototypeProperties(Dictionary, null, {
    _initializeRecords: {
      value: function _initializeRecords(records) {
        keys(records).forEach(function (languageCode) {
          var language = records[languageCode];

          this.setCurrentLanguage(languageCode);

          if (language.texts) {
            this.addTexts(language.texts);
          }

          if (language.components) {
            keys(language.components).forEach(function (prefix) {
              this.addTexts(language.components[prefix], prefix);
            }, this);
          }
        }, this);
      },
      writable: true,
      configurable: true
    },
    getCurrentLanguage: {
      value: function getCurrentLanguage() {
        return this.currentLanguage;
      },
      writable: true,
      configurable: true
    },
    setCurrentLanguage: {
      value: function setCurrentLanguage(currentLanguage) {
        console.assert(isString(currentLanguage), "currentLanguage is not a string");
        console.assert(currentLanguage.length === 2, "currentLanguage is not a supported code");

        if (isNone(this.getLanguage(currentLanguage))) {
          this.addLanguage(currentLanguage);
        }

        this.currentLanguage = currentLanguage;

        return currentLanguage;
      },
      writable: true,
      configurable: true
    },
    getLanguage: {
      value: function getLanguage(lang) {
        if (!isString(lang)) {
          return this.languages[this.getCurrentLanguage()];
        }

        console.assert(lang.length === 2, "lang is not a supported code");

        return this.languages[lang];
      },
      writable: true,
      configurable: true
    },
    addLanguage: {
      value: function addLanguage(languageCode) {
        console.assert(!(languageCode in this.languages), "'" + languageCode + "' is already exists in languages");

        this.languages[languageCode] = new Language({ recordTexts: this.RECORD_TEXTS });
      },
      writable: true,
      configurable: true
    },
    getLanguagesList: {
      value: function getLanguagesList() {
        return keys(this.languages);
      },
      writable: true,
      configurable: true
    },
    addTexts: {
      value: function addTexts(preTemplates) {
        var prefix = arguments[1] === undefined ? "" : arguments[1];

        var activeDictionary = this.getLanguage();

        activeDictionary.add(preTemplates, prefix);

        return this;
      },
      writable: true,
      configurable: true
    },
    t: {
      value: function t(text, prefix) {
        for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          params[_key - 2] = arguments[_key];
        }

        /** @validation For empty text return empty string */
        if (text === "" || text === undefined) {
          return "";
        }

        var activeDictionary = this.getLanguage();
        var template = activeDictionary.get(text, prefix);

        return template(params);
      },
      writable: true,
      configurable: true
    },
    c: {
      value: function c(text, prefix, count) {
        for (var _len = arguments.length, params = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
          params[_key - 3] = arguments[_key];
        }

        /** @validation For empty text return empty string */
        if (text === "" || text === undefined) {
          return "";
        }

        var activeDictionary = this.getLanguage();
        var template = activeDictionary.get(text, prefix);

        return template(count, params);
      },
      writable: true,
      configurable: true
    },
    gt: {

      /** Shortcut to `t` with no prefix */

      value: function gt(text) {
        var _ref;

        for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          params[_key - 1] = arguments[_key];
        }

        return (_ref = this).t.apply(_ref, [text, ""].concat(params));
      },
      writable: true,
      configurable: true
    },
    gc: {

      /** Shortcut to `c` with no prefix */

      value: function gc(text, count) {
        var _ref;

        for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          params[_key - 2] = arguments[_key];
        }

        return (_ref = this).c.apply(_ref, [text, "", count].concat(params));
      },
      writable: true,
      configurable: true
    },
    getShortcuts: {

      /** For server side use to inject template functions */

      value: function getShortcuts() {
        return {
          lang: (function lang() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            if (args.length > 0) {
              this.setCurrentLanguage.apply(this, args);
            } else {
              return this.getCurrentLanguage();
            }
          }).bind(this),
          t: this.t.bind(this),
          c: this.c.bind(this),
          gt: this.gt.bind(this),
          gc: this.gc.bind(this)
        };
      },
      writable: true,
      configurable: true
    },
    getRecords: {
      value: function getRecords() {
        if (!this.RECORD_TEXTS) {
          return null;
        }

        var records = {};

        this.getLanguagesList().forEach(function (languageCode) {
          var langauge = this.getLanguage(languageCode);
          records[languageCode] = langauge.getRecords();
        }, this);

        return records;
      },
      writable: true,
      configurable: true
    }
  });

  return Dictionary;
})();

module.exports = Dictionary;

},{"./constants/default-language":4,"./language":6,"./utils/type-of":16,"object-assign":2}],2:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],3:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var createEnum = _interopRequire(require("../utils/create-enum"));

module.exports = createEnum("none", "single", "other");

},{"../utils/create-enum":11}],4:[function(require,module,exports){
"use strict";

module.exports = "en";

},{}],5:[function(require,module,exports){
"use strict";

module.exports = /(?:{{)([0-9A-Za-z]+)(?:}})/g;

},{}],6:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assign = _interopRequire(require("object-assign"));

var runtime = _interopRequire(require("./runtime"));

var _utilsTypeOf = require("./utils/type-of");

var typeOf = _interopRequire(_utilsTypeOf);

var isString = _utilsTypeOf.isString;
var isBoolean = _utilsTypeOf.isBoolean;
var isObject = _utilsTypeOf.isObject;
var keys = Object.keys;

var Language = (function () {
  function Language(features) {
    _classCallCheck(this, Language);

    var FEATURES = assign({
      recordTexts: false
    }, features);

    console.assert(isBoolean(FEATURES.recordTexts), "recordTexts is not a boolean");

    this.RECORD_TEXTS = FEATURES.recordTexts;
    this.texts = {};
    this.components = {};

    if (this.RECORD_TEXTS) {
      this.preTexts = {};
      this.preComponents = {};
    }
  }

  _prototypeProperties(Language, {
    concatTexts: {
      value: function concatTexts(context, preTemplates) {
        console.assert(isObject(context), "context is not an object");
        console.assert(isObject(preTemplates), "preTemplates is not a string");

        var newContext = assign({}, context);

        keys(preTemplates).forEach(function (key) {
          console.assert(!(key in this), "concatTexts(): preTemplates template assign is override exist key");

          var preTemplate = preTemplates[key];

          console.assert(isString(preTemplate) || keys(preTemplate).every(function (k) {
            return isString(preTemplate[k]);
          }), "preTemplate is not a string or object of strings");

          this[key] = runtime[runtime.typeOf(preTemplate)](preTemplate);
        }, newContext);

        return newContext;
      },
      writable: true,
      configurable: true
    }
  }, {
    _record: {

      /**
       * Saves preTemplates
       * @param  {Object of String or Object} from Pre templates before compilation
       * @param  {String} prefix                   Prefix if texts related to component
       *
       * @validation NOTE: asserts made in `concatTexts` and `add`
       */

      value: function _record(from, prefix) {
        /** @type {Object of String or Object} The container of recorded pre templates */
        var to = prefix ? this.preComponents[prefix] || (this.preComponents[prefix] = {}) : this.preTexts;

        keys(from).forEach(function (tag) {
          var text = from[tag];

          switch (typeOf(text)) {
            case "string":
              assign(to, _defineProperty({}, tag, text));
              break;

            case "object":
              to[tag] = isObject(from[tag]) ? from[tag] : {};

              keys(text).forEach((function (to, from, tag) {
                var text = from[tag];

                if (isString(text)) {
                  assign(to, _defineProperty({}, tag, text));
                }
              }).bind(this, to[tag], from[tag]));
              break;
          }
        });
      },
      writable: true,
      configurable: true
    },
    add: {
      value: function add(preTemplates) {
        var prefix = arguments[1] === undefined ? "" : arguments[1];

        console.assert(isObject(preTemplates), "preTemplates is not a string");
        console.assert(isString(prefix), "prefix is not a string");

        /** Texts templates */
        if (prefix) {
          console.assert(!(prefix in this.components), "prefix already assigned");

          this.components[prefix] = Language.concatTexts({}, preTemplates);
        } else {
          this.texts = Language.concatTexts(this.texts, preTemplates);
        }

        if (this.RECORD_TEXTS) {
          this._record(preTemplates, prefix);
        }
      },
      writable: true,
      configurable: true
    },
    get: {

      /** @todo modify() */

      value: function get(text) {
        var prefix = arguments[1] === undefined ? "" : arguments[1];

        console.assert(isString(text), "text is not a string");
        console.assert(text.length > 0, "text is empty");
        console.assert(isString(prefix), "prefix is not a string");

        if (prefix.length > 0) {
          console.assert(prefix in this.components, "prefix is not in this.components");
          console.assert(text in this.components[prefix], "text is in not in this.components.prefix");

          return this.components[prefix][text];
        } else {
          console.assert(text in this.texts, "'" + text + "' is in not in this.texts");

          return this.texts[text];
        }
      },
      writable: true,
      configurable: true
    },
    getRecords: {
      value: function getRecords() {
        if (!this.RECORD_TEXTS) {
          return null;
        }

        return {
          texts: this.preTexts,
          components: this.preComponents
        };
      },
      writable: true,
      configurable: true
    }
  });

  return Language;
})();

module.exports = Language;

},{"./runtime":7,"./utils/type-of":16,"object-assign":2}],7:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var count = _interopRequire(require("./runtime/count"));

var text = _interopRequire(require("./runtime/text"));

var typeOfTemplate = _interopRequire(require("./utils/type-of-template"));

module.exports = {
  count: count,
  text: text,
  typeOf: typeOfTemplate
};

},{"./runtime/count":8,"./runtime/text":9,"./utils/type-of-template":15}],8:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

/**
 * Compile text with a parameter of amount to a template function
 * @param  {String} text        String that may contain parameters inside the string
 * @param  {RegExp} paramsRegex The regular expression to extract parameters
 *                              locations and names
 * @return {Function}           The template function
 */
module.exports = compileCount;

var assign = _interopRequire(require("object-assign"));

var template = _interopRequire(require("../template"));

var COUNT_KEYS = _interopRequire(require("../constants/compile-count-keys"));

var PARAM_REGEX = _interopRequire(require("../constants/param-regex"));

var _utilsTypeOf = require("../utils/type-of");

var isObject = _utilsTypeOf.isObject;
var isString = _utilsTypeOf.isString;
var isNumeric = _utilsTypeOf.isNumeric;
var isEmpty = _utilsTypeOf.isEmpty;
var keys = Object.keys;

function compileCount(texts) {
  var paramsRegex = arguments[1] === undefined ? PARAM_REGEX : arguments[1];

  console.assert(isObject(texts), "texts isn't an object");
  console.assert(!isEmpty(texts), "texts is an empty object");
  console.assert(keys(texts).every(function (key) {
    return isString(texts[key]);
  }), "texts contains none string object");

  var textsParamsObject =
  /** Takes out the keys for iteration */
  keys(texts)
  /** Creates textsParams for each key */
  .map(function (key) {
    return [key, texts[key].split(paramsRegex)];
  })
  /** Convert the array back to object */
  .reduce(function (obj, array) {
    return assign(obj, _defineProperty({}, array[0], array[1]));
  }, {});

  return function templateWrapper(count) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    console.assert(isNumeric(count), "texts isn't a number");

    /** @type {Array of String} Check if the first argument contains an array of
                                of string or the params themselves are the array
                                of string */
    var paramsObject = params.length && !isString(params[0]) ? params[0] : params;
    /** @type {Object of String} The object of params with the count property */
    var paramsObjectWithCount = assign({}, paramsObject, { count: count });

    /** NONE */
    if (count === 0 && COUNT_KEYS.none in textsParamsObject) {
      return template(textsParamsObject.none, paramsObjectWithCount);
      /** SINGLE */
    } else if (count === 1 && COUNT_KEYS.single in textsParamsObject) {
      return template(textsParamsObject.single, paramsObjectWithCount);
      /** OTHER */
    } else if (COUNT_KEYS.other in textsParamsObject) {
      return template(textsParamsObject.other, paramsObjectWithCount);
    }

    console.warn("There is no match textsParams to the count");

    return "";
  };
}

},{"../constants/compile-count-keys":3,"../constants/param-regex":5,"../template":10,"../utils/type-of":16,"object-assign":2}],9:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

/**
 * Compile text to a template function
 * @param  {String} text        String that may contain parameters in string
 * @param  {RegExp} paramsRegex The regular expression to extract parameters
 *                              locations and names
 * @return {Function}           The template function
 */
module.exports = compileText;

var template = _interopRequire(require("../template"));

var PARAM_REGEX = _interopRequire(require("../constants/param-regex"));

var isString = require("../utils/type-of").isString;

function compileText(text) {
  var paramsRegex = arguments[1] === undefined ? PARAM_REGEX : arguments[1];

  console.assert(isString(text), "text isn't a string");

  var textsParams = text.split(paramsRegex);

  return function templateWrapper() {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    /** @type {Array of String} Check if the first argument contains an array of
                                of string or the params themselves are the array
                                of string */
    var paramsObject = params.length && !isString(params[0]) ? params[0] : params;

    return template(textsParams, paramsObject);
  };
}

},{"../constants/param-regex":5,"../template":10,"../utils/type-of":16}],10:[function(require,module,exports){
"use strict";

/**
 * Takes array of texts and properties names' and parameters and returns a text
 * @param  {Array of String} textsParams Array of texts and parameters names
 *                                       it construct in a way of:
 *                                       - even indexes are plain text as is
 *                                       - odd indexes are key name in params
 * @param  {Object of String} params     The parameters values
 * @return {String}                      The text
 */
module.exports = template;

var _utilsTypeOf = require("./utils/type-of");

var isArray = _utilsTypeOf.isArray;
var isObject = _utilsTypeOf.isObject;
var isString = _utilsTypeOf.isString;

function template(textsParams) {
  var params = arguments[1] === undefined ? {} : arguments[1];

  console.assert(isArray(textsParams), "textsParams isn't an array");
  console.assert(textsParams.every(isString), "textsParams isn't an array of strings");
  console.assert(isArray(params) || isObject(params), "params isn't an array or object");

  return textsParams.map(function (key, index) {
    /** If key is a plain text. (even indexes) */
    if (index % 2 === 0) {
      return key;
    }

    /** If key is for property name. (odd indexes) */
    console.assert(key !== "", "textsParams[" + index + "] is an empty string");

    return key in params ? params[key] : "";
  }).join("");
}

},{"./utils/type-of":16}],11:[function(require,module,exports){
"use strict";

module.exports = createEnum;

var _typeOf = require("./type-of");

var isEmpty = _typeOf.isEmpty;
var isString = _typeOf.isString;

function createEnum() {
  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  console.assert(!isEmpty(params), "params are empty");

  var obj = {};

  params.forEach(function (param) {
    console.assert(isString(param), "param is not a string");
    console.assert(!isEmpty(param), "param is empty");

    obj[param] = param;
  });

  return obj;
}

},{"./type-of":16}],12:[function(require,module,exports){
"use strict";

module.exports = isFinite;

},{}],13:[function(require,module,exports){
"use strict";

exports.createNoop = createNoop;
exports["default"] = noop;

function createNoop() {
  return function noop() {};
}

function noop() {}

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{}],14:[function(require,module,exports){
"use strict";

/**
 * Shortcut to `Object.prototype.toString.call`
 * @param  {Object} x
 * @return {String}   The type of object
 */
module.exports = ObjectToString;

function ObjectToString(x) {
  return Object.prototype.toString.call(x);
}

},{}],15:[function(require,module,exports){
"use strict";

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
module.exports = typeOfTemplate;

var _typeOf = require("./type-of");

var isString = _typeOf.isString;
var isObject = _typeOf.isObject;
var isEmpty = _typeOf.isEmpty;

function typeOfTemplate(obj) {
  console.assert(!isEmpty(obj), "template cannot be empty");

  if (isString(obj)) {
    return "text";
  }

  if (isObject(obj)) {
    return "count";
  }

  throw new TypeError("Unknown type of template");
}

},{"./type-of":16}],16:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

exports.isUndefined = isUndefined;
exports.isNull = isNull;
exports.isBoolean = isBoolean;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.isDate = isDate;
exports.isNumber = isNumber;
exports.isNaN = isNaN;
exports.isFinite = isFinite;
exports.isString = isString;
exports.isNone = isNone;
exports.isEmpty = isEmpty;
exports["default"] = typeOf;
/**
 * Get the type of variable.
 * based on Ember/Metal/Utils/typeOf
 *
 * @support ES5+
 */

var assign = _interopRequire(require("object-assign"));

var createNoop = require("./noop").createNoop;

var objectToString = _interopRequire(require("./object-to-string"));

var nativeIsFinite = _interopRequire(require("./native-is-finite"));

/** @type {Array of String} Supported types detection */
var SUPPORTED_TYPES = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"];
/** @type {Object of String} Map of types and to returned value from `Object.prototype.toString` */
var TYPE_MAP = SUPPORTED_TYPES.reduce(function (x, y) {
  return assign(x, _defineProperty({}, "[object " + y + "]", y.toLowerCase()));
}, {});

function isUndefined(x) {
  return x === undefined;
}

function isNull(x) {
  return x === null;
}

function isBoolean(x) {
  return x === true || x === false;
}

function isArray(x) {
  return Array.isArray(x);
}

function isObject(x) {
  return objectToString(x) === "[object Object]";
}

function isFunction(x) {
  var uint8a = typeof Uint8Array !== "undefined" ? Uint8Array : createNoop();

  return typeof x === "function" && !(x instanceof uint8a);
}

function isDate(x) {
  // from https://github.com/lodash/lodash/blob/es6/lang/isDate.js
  return objectToString(x) === "[object Date]";
}

function isNumber(x) {
  return typeof x === "number" || objectToString(x) === "[object Number]";
}

function isNaN(x) {
  if (Number.iNaN) {
    return Number.isNaN(x);
  }

  // based on: https://github.com/lodash/lodash/blob/es6/lang/isNaN.js
  return isNumber(x) && x !== Number(x);
}

function isFinite(x) {
  if (Number.isFinite) {
    return Number.isFinite(x);
  }

  // based on: https://github.com/lodash/lodash/blob/es6/lang/isFinite.js
  return nativeIsFinite(x) && isNumber(x);
}

/** ES6 `isFinite` does the same thing */
var isNumeric = exports.isNumeric = isFinite;

function isString(x) {
  return typeof x === "string" || objectToString(x) === "[object String]";
}

function isNone(x) {
  return isUndefined(x) || isNull(x);
}

function isEmpty(x) {
  if (isNone(x)) {
    return true;
  }

  if (isNaN(x)) {
    return true;
  }

  if (isArray(x) && x.length === 0) {
    return true;
  }

  if (isObject(x) && Object.keys(x).length === 0) {
    return true;
  }

  if (isString(x) && x.length === 0) {
    return true;
  }

  return false;
}

function typeOf(x) {
  if (isUndefined(x)) {
    return "undefined";
  }

  if (isNull(x)) {
    return "null";
  }

  if (isFunction(x)) {
    return "function";
  }

  /** @type {String} If didn't pass the custom tests */
  var type = objectToString(x);

  /** The fallback is always `object` */
  return type in TYPE_MAP ? TYPE_MAP[type] : "object";
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"./native-is-finite":12,"./noop":13,"./object-to-string":14,"object-assign":2}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvb3Jpc29tZXRoaW5nL2hhcHB5c2FsZS9kaWN0aW9uYXJ5L3NyYy9kaWN0aW9uYXJ5LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIvVXNlcnMvb3Jpc29tZXRoaW5nL2hhcHB5c2FsZS9kaWN0aW9uYXJ5L3NyYy9jb25zdGFudHMvY29tcGlsZS1jb3VudC1rZXlzLmpzIiwiL1VzZXJzL29yaXNvbWV0aGluZy9oYXBweXNhbGUvZGljdGlvbmFyeS9zcmMvY29uc3RhbnRzL2RlZmF1bHQtbGFuZ3VhZ2UuanMiLCIvVXNlcnMvb3Jpc29tZXRoaW5nL2hhcHB5c2FsZS9kaWN0aW9uYXJ5L3NyYy9jb25zdGFudHMvcGFyYW0tcmVnZXguanMiLCIvVXNlcnMvb3Jpc29tZXRoaW5nL2hhcHB5c2FsZS9kaWN0aW9uYXJ5L3NyYy9sYW5ndWFnZS5qcyIsIi9Vc2Vycy9vcmlzb21ldGhpbmcvaGFwcHlzYWxlL2RpY3Rpb25hcnkvc3JjL3J1bnRpbWUuanMiLCIvVXNlcnMvb3Jpc29tZXRoaW5nL2hhcHB5c2FsZS9kaWN0aW9uYXJ5L3NyYy9ydW50aW1lL2NvdW50LmpzIiwiL1VzZXJzL29yaXNvbWV0aGluZy9oYXBweXNhbGUvZGljdGlvbmFyeS9zcmMvcnVudGltZS90ZXh0LmpzIiwiL1VzZXJzL29yaXNvbWV0aGluZy9oYXBweXNhbGUvZGljdGlvbmFyeS9zcmMvdGVtcGxhdGUuanMiLCIvVXNlcnMvb3Jpc29tZXRoaW5nL2hhcHB5c2FsZS9kaWN0aW9uYXJ5L3NyYy91dGlscy9jcmVhdGUtZW51bS5qcyIsIi9Vc2Vycy9vcmlzb21ldGhpbmcvaGFwcHlzYWxlL2RpY3Rpb25hcnkvc3JjL3V0aWxzL25hdGl2ZS1pcy1maW5pdGUuanMiLCIvVXNlcnMvb3Jpc29tZXRoaW5nL2hhcHB5c2FsZS9kaWN0aW9uYXJ5L3NyYy91dGlscy9ub29wLmpzIiwiL1VzZXJzL29yaXNvbWV0aGluZy9oYXBweXNhbGUvZGljdGlvbmFyeS9zcmMvdXRpbHMvb2JqZWN0LXRvLXN0cmluZy5qcyIsIi9Vc2Vycy9vcmlzb21ldGhpbmcvaGFwcHlzYWxlL2RpY3Rpb25hcnkvc3JjL3V0aWxzL3R5cGUtb2YtdGVtcGxhdGUuanMiLCIvVXNlcnMvb3Jpc29tZXRoaW5nL2hhcHB5c2FsZS9kaWN0aW9uYXJ5L3NyYy91dGlscy90eXBlLW9mLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTyxNQUFNLDJCQUFNLGVBQWU7O0lBQzNCLGdCQUFnQiwyQkFBTSw4QkFBOEI7OzJCQUNMLGlCQUFpQjs7SUFBOUQsUUFBUSxnQkFBUixRQUFRO0lBQUUsU0FBUyxnQkFBVCxTQUFTO0lBQUUsUUFBUSxnQkFBUixRQUFRO0lBQUUsTUFBTSxnQkFBTixNQUFNOztJQUN2QyxRQUFRLDJCQUFNLFlBQVk7O0lBQ3pCLElBQUksR0FBSyxNQUFNLENBQWYsSUFBSTs7SUFHTixVQUFVO0FBQ0gsV0FEUCxVQUFVO1FBQ0YsUUFBUSxnQ0FBRyxFQUFFOzswQkFEckIsVUFBVTs7QUFFWixXQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDOztBQUVoRSxRQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQ2pDLFFBQU0sUUFBUSxHQUNaLEFBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQUFBQyxHQUN0RSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQ2hCLGdCQUFnQixBQUNqQixDQUFDO0FBQ0YsUUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLGNBQVEsRUFBRSxRQUFRO0FBQ2xCLGlCQUFXLEVBQUUsS0FBSztBQUNs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QUFDLEVBQUU7QUFDekIsTUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDYixXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELE1BQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ1osV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxNQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNoQyxXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELE1BQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUM5QyxXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELE1BQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ2pDLFdBQU8sSUFBSSxDQUFDO0dBQ2I7O0FBRUQsU0FBTyxLQUFLLENBQUM7Q0FDZDs7QUFFYyxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUU7QUFDaEMsTUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDbEIsV0FBTyxXQUFXLENBQUM7R0FDcEI7O0FBRUQsTUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDYixXQUFPLE1BQU0sQ0FBQztHQUNmOztBQUVELE1BQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2pCLFdBQU8sVUFBVSxDQUFDO0dBQ25COzs7QUFHRCxNQUFJLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7OztBQUc3QixTQUFPLEFBQUMsSUFBSSxJQUFJLFFBQVEsR0FBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO0NBQ3ZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgREVGQVVMVF9MQU5HVUFHRSBmcm9tICcuL2NvbnN0YW50cy9kZWZhdWx0LWxhbmd1YWdlJztcbmltcG9ydCB7IGlzU3RyaW5nLCBpc0Jvb2xlYW4sIGlzT2JqZWN0LCBpc05vbmUgfSBmcm9tICcuL3V0aWxzL3R5cGUtb2YnO1xuaW1wb3J0IExhbmd1YWdlIGZyb20gJy4vbGFuZ3VhZ2UnO1xuY29uc3QgeyBrZXlzIH0gPSBPYmplY3Q7XG5cblxuY2xhc3MgRGljdGlvbmFyeSB7XG4gIGNvbnN0cnVjdG9yKGZlYXR1cmVzID0ge30pIHtcbiAgICBjb25zb2xlLmFzc2VydChpc09iamVjdChmZWF0dXJlcyksICdmZWF0dXJlcyBpcyBub3QgYW4gb2JqZWN0Jyk7XG5cbiAgICBjb25zdCBSRUNPUkRTID0gZmVhdHVyZXMucmVjb3JkcztcbiAgICBjb25zdCBMQU5HVUFHRSA9IChcbiAgICAgIChpc09iamVjdChSRUNPUkRTKSAmJiAoa2V5cyhSRUNPUkRTKS5pbmRleE9mKERFRkFVTFRfTEFOR1VBR0UpID09PSAtMSkpID9cbiAgICAgIGtleXMoUkVDT1JEUylbMF0gOlxuICAgICAgREVGQVVMVF9MQU5HVUFHRVxuICAgICk7XG4gICAgY29uc3QgRkVBVFVSRVMgPSBhc3NpZ24oe1xuICAgICAgbGFuZ3VhZ2U6IExBTkdVQUdFLFxuICAgICAgcmVjb3JkVGV4dHM6IGZhbHNlLFxuICAgICAgcmVjb3JkczogUkVDT1JEUyB8fCBudWxsXG4gICAgfSwgZmVhdHVyZXMpO1xuXG4gICAgY29uc29sZS5hc3NlcnQoaXNTdHJpbmcoRkVBVFVSRVMubGFuZ3VhZ2UpLCAnbGFuZ3VhZ2UgaXMgbm90IGEgc3RpbmcnKTtcbiAgICBjb25zb2xlLmFzc2VydChpc0Jvb2xlYW4oRkVBVFVSRVMucmVjb3JkVGV4dHMpLCAncmVjb3JkVGV4dHMgaXMgbm90IGEgYm9vbGVhbicpO1xuICAgIGNvbnNvbGUuYXNzZXJ0KGlzTm9uZShGRUFUVVJFUy5yZWNvcmRzKSB8fCBpc09iamVjdChGRUFUVVJFUy5yZWNvcmRzKSwgJ3JlY29yZHMgaXMgbm90IGFuIG9iamVjdCBvciBhIG51bGwnKTtcblxuICAgIHRoaXMuUkVDT1JEX1RFWFRTID0gRkVBVFVSRVMucmVjb3JkVGV4dHM7XG4gICAgdGhpcy5sYW5ndWFnZXMgPSB7fTtcbiAgICB0aGlzLnNldEN1cnJlbnRMYW5ndWFnZShGRUFUVVJFUy5sYW5ndWFnZSk7XG5cbiAgICBpZiAoRkVBVFVSRVMucmVjb3Jkcykge1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZVJlY29yZHMoRkVBVFVSRVMucmVjb3Jkcyk7XG4gICAgfVxuICB9XG5cbiAgX2luaXRpYWxpemVSZWNvcmRzKHJlY29yZHMpIHtcbiAgICBrZXlzKHJlY29yZHMpLmZvckVhY2goZnVuY3Rpb24obGFuZ3VhZ2VDb2RlKSB7XG4gICAgICBsZXQgbGFuZ3VhZ2UgPSByZWNvcmRzW2xhbmd1YWdlQ29kZV07XG5cbiAgICAgIHRoaXMuc2V0Q3VycmVudExhbmd1YWdlKGxhbmd1YWdlQ29kZSk7XG5cbiAgICAgIGlmIChsYW5ndWFnZS50ZXh0cykge1xuICAgICAgICB0aGlzLmFkZFRleHRzKGxhbmd1YWdlLnRleHRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhbmd1YWdlLmNvbXBvbmVudHMpIHtcbiAgICAgICAga2V5cyhsYW5ndWFnZS5jb21wb25lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgICAgIHRoaXMuYWRkVGV4dHMobGFuZ3VhZ2UuY29tcG9uZW50c1twcmVmaXhdLCBwcmVmaXgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRMYW5ndWFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TGFuZ3VhZ2U7XG4gIH1cblxuICBzZXRDdXJyZW50TGFuZ3VhZ2UoY3VycmVudExhbmd1YWdlKSB7XG4gICAgY29uc29sZS5hc3NlcnQoaXNTdHJpbmcoY3VycmVudExhbmd1YWdlKSwgJ2N1cnJlbnRMYW5ndWFnZSBpcyBub3QgYSBzdHJpbmcnKTtcbiAgICBjb25zb2xlLmFzc2VydChjdXJyZW50TGFuZ3VhZ2UubGVuZ3RoID09PSAyLCAnY3VycmVudExhbmd1YWdlIGlzIG5vdCBhIHN1cHBvcnRlZCBjb2RlJyk7XG5cbiAgICBpZiAoaXNOb25lKHRoaXMuZ2V0TGFuZ3VhZ2UoY3VycmVudExhbmd1YWdlKSkpIHtcbiAgICAgIHRoaXMuYWRkTGFuZ3VhZ2UoY3VycmVudExhbmd1YWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRMYW5ndWFnZSA9IGN1cnJlbnRMYW5ndWFnZTtcblxuICAgIHJldHVybiBjdXJyZW50TGFuZ3VhZ2U7XG4gIH1cblxuICBnZXRMYW5ndWFnZShsYW5nKSB7XG4gICAgaWYgKCEgaXNTdHJpbmcobGFuZykpIHtcbiAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlc1t0aGlzLmdldEN1cnJlbnRMYW5ndWFnZSgpXTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmFzc2VydChsYW5nLmxlbmd0aCA9PT0gMiwgJ2xhbmcgaXMgbm90IGEgc3VwcG9ydGVkIGNvZGUnKTtcblxuICAgIHJldHVybiB0aGlzLmxhbmd1YWdlc1tsYW5nXTtcbiAgfVxuXG4gIGFkZExhbmd1YWdlKGxhbmd1YWdlQ29kZSkge1xuICAgIGNvbnNvbGUuYXNzZXJ0KCEgKGxhbmd1YWdlQ29kZSBpbiB0aGlzLmxhbmd1YWdlcyksIGAnJHtsYW5ndWFnZUNvZGV9JyBpcyBhbHJlYWR5IGV4aXN0cyBpbiBsYW5ndWFnZXNgKTtcblxuICAgIHRoaXMubGFuZ3VhZ2VzW2xhbmd1YWdlQ29kZV0gPSBuZXcgTGFuZ3VhZ2UoeyByZWNvcmRUZXh0czogdGhpcy5SRUNPUkRfVEVYVFMgfSk7XG4gIH1cblxuICBnZXRMYW5ndWFnZXNMaXN0KCkge1xuICAgcmV0dXJuIGtleXModGhpcy5sYW5ndWFnZXMpO1xuICB9XG5cbiAgYWRkVGV4dHMocHJlVGVtcGxhdGVzLCBwcmVmaXggPSAnJykge1xuICAgIGNvbnN0IGFjdGl2ZURpY3Rpb25hcnkgPSB0aGlzLmdldExhbmd1YWdlKCk7XG5cbiAgICBhY3RpdmVEaWN0aW9uYXJ5LmFkZChwcmVUZW1wbGF0ZXMsIHByZWZpeCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHQodGV4dCwgcHJlZml4LCAuLi5wYXJhbXMpIHtcbiAgICAvKiogQHZhbGlkYXRpb24gRm9yIGVtcHR5IHRleHQgcmV0dXJuIGVtcHR5IHN0cmluZyAqL1xuICAgIGlmICh0ZXh0ID09PSAnJyB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVEaWN0aW9uYXJ5ID0gdGhpcy5nZXRMYW5ndWFnZSgpO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gYWN0aXZlRGljdGlvbmFyeS5nZXQodGV4dCwgcHJlZml4KTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZShwYXJhbXMpO1xuICB9XG5cbiAgYyh0ZXh0LCBwcmVmaXgsIGNvdW50LCAuLi5wYXJhbXMpIHtcbiAgICAvKiogQHZhbGlkYXRpb24gRm9yIGVtcHR5IHRleHQgcmV0dXJuIGVtcHR5IHN0cmluZyAqL1xuICAgIGlmICh0ZXh0ID09PSAnJyB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVEaWN0aW9uYXJ5ID0gdGhpcy5nZXRMYW5ndWFnZSgpO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gYWN0aXZlRGljdGlvbmFyeS5nZXQodGV4dCwgcHJlZml4KTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZShjb3VudCwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKiBTaG9ydGN1dCB0byBgdGAgd2l0aCBubyBwcmVmaXggKi9cbiAgZ3QodGV4dCwgLi4ucGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMudCh0ZXh0LCAnJywgLi4ucGFyYW1zKTtcbiAgfVxuXG4gIC8qKiBTaG9ydGN1dCB0byBgY2Agd2l0aCBubyBwcmVmaXggKi9cbiAgZ2ModGV4dCwgY291bnQsIC4uLnBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmModGV4dCwgJycsIGNvdW50LCAuLi5wYXJhbXMpO1xuICB9XG5cbiAgLyoqIEZvciBzZXJ2ZXIgc2lkZSB1c2UgdG8gaW5qZWN0IHRlbXBsYXRlIGZ1bmN0aW9ucyAqL1xuICBnZXRTaG9ydGN1dHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhbmc6IGZ1bmN0aW9uIGxhbmcoLi4uYXJncykge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5zZXRDdXJyZW50TGFuZ3VhZ2UuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudExhbmd1YWdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIHQ6IHRoaXMudC5iaW5kKHRoaXMpLFxuICAgICAgYzogdGhpcy5jLmJpbmQodGhpcyksXG4gICAgICBndDogdGhpcy5ndC5iaW5kKHRoaXMpLFxuICAgICAgZ2M6IHRoaXMuZ2MuYmluZCh0aGlzKVxuICAgIH07XG4gIH1cblxuICBnZXRSZWNvcmRzKCkge1xuICAgIGlmICghIHRoaXMuUkVDT1JEX1RFWFRTKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgcmVjb3JkcyA9IHt9O1xuXG4gICAgdGhpcy5nZXRMYW5ndWFnZXNMaXN0KCkuZm9yRWFjaChmdW5jdGlvbihsYW5ndWFnZUNvZGUpIHtcbiAgICAgIGNvbnN0IGxhbmdhdWdlID0gdGhpcy5nZXRMYW5ndWFnZShsYW5ndWFnZUNvZGUpO1xuICAgICAgcmVjb3Jkc1tsYW5ndWFnZUNvZGVdID0gbGFuZ2F1Z2UuZ2V0UmVjb3JkcygpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHJlY29yZHM7XG4gIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBEaWN0aW9uYXJ5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBUb09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIGtleXM7XG5cdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gYXJndW1lbnRzW3NdO1xuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0b1trZXlzW2ldXSA9IGZyb21ba2V5c1tpXV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImltcG9ydCBjcmVhdGVFbnVtIGZyb20gJy4uL3V0aWxzL2NyZWF0ZS1lbnVtJztcblxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFbnVtKCdub25lJywgJ3NpbmdsZScsICdvdGhlcicpO1xuIiwiZXhwb3J0IGRlZmF1bHQgJ2VuJztcbiIsImV4cG9ydCBkZWZhdWx0ICggLyg/Ont7KShbMC05QS1aYS16XSspKD86fX0pL2cgKTtcbiIsImltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgcnVudGltZSBmcm9tICcuL3J1bnRpbWUnO1xuaW1wb3J0IHsgZGVmYXVsdCBhcyB0eXBlT2YsIGlzU3RyaW5nLCBpc0Jvb2xlYW4sIGlzT2JqZWN0IH0gZnJvbSAnLi91dGlscy90eXBlLW9mJztcbmNvbnN0IHsga2V5cyB9ID0gT2JqZWN0O1xuXG5cbmNsYXNzIExhbmd1YWdlIHtcbiAgc3RhdGljIGNvbmNhdFRleHRzKGNvbnRleHQsIHByZVRlbXBsYXRlcykge1xuICAgIGNvbnNvbGUuYXNzZXJ0KGlzT2JqZWN0KGNvbnRleHQpLCAnY29udGV4dCBpcyBub3QgYW4gb2JqZWN0Jyk7XG4gICAgY29uc29sZS5hc3NlcnQoaXNPYmplY3QocHJlVGVtcGxhdGVzKSwgJ3ByZVRlbXBsYXRlcyBpcyBub3QgYSBzdHJpbmcnKTtcblxuICAgIGxldCBuZXdDb250ZXh0ID0gYXNzaWduKHt9LCBjb250ZXh0KTtcblxuICAgIGtleXMocHJlVGVtcGxhdGVzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgY29uc29sZS5hc3NlcnQoISAoa2V5IGluIHRoaXMpLCAnY29uY2F0VGV4dHMoKTogcHJlVGVtcGxhdGVzIHRlbXBsYXRlIGFzc2lnbiBpcyBvdmVycmlkZSBleGlzdCBrZXknKTtcblxuICAgICAgbGV0IHByZVRlbXBsYXRlID0gcHJlVGVtcGxhdGVzW2tleV07XG5cbiAgICAgIGNvbnNvbGUuYXNzZXJ0KChcbiAgICAgICAgaXNTdHJpbmcocHJlVGVtcGxhdGUpIHx8XG4gICAgICAgIChrZXlzKHByZVRlbXBsYXRlKS5ldmVyeSgoaykgPT4gaXNTdHJpbmcocHJlVGVtcGxhdGVba10pKSlcbiAgICAgICksICdwcmVUZW1wbGF0ZSBpcyBub3QgYSBzdHJpbmcgb3Igb2JqZWN0IG9mIHN0cmluZ3MnKTtcblxuICAgICAgdGhpc1trZXldID0gcnVudGltZVtydW50aW1lLnR5cGVPZihwcmVUZW1wbGF0ZSldKHByZVRlbXBsYXRlKTtcbiAgICB9LCBuZXdDb250ZXh0KTtcblxuICAgIHJldHVybiBuZXdDb250ZXh0O1xuICB9XG5cbiAgY29uc3RydWN0b3IoZmVhdHVyZXMpIHtcbiAgICBjb25zdCBGRUFUVVJFUyA9IGFzc2lnbih7XG4gICAgICByZWNvcmRUZXh0czogZmFsc2VcbiAgICB9LCBmZWF0dXJlcyk7XG5cbiAgICBjb25zb2xlLmFzc2VydChpc0Jvb2xlYW4oRkVBVFVSRVMucmVjb3JkVGV4dHMpLCAncmVjb3JkVGV4dHMgaXMgbm90IGEgYm9vbGVhbicpO1xuXG4gICAgdGhpcy5SRUNPUkRfVEVYVFMgPSBGRUFUVVJFUy5yZWNvcmRUZXh0cztcbiAgICB0aGlzLnRleHRzID0ge307XG4gICAgdGhpcy5jb21wb25lbnRzID0ge307XG5cbiAgICBpZiAodGhpcy5SRUNPUkRfVEVYVFMpIHtcbiAgICAgIHRoaXMucHJlVGV4dHMgPSB7fTtcbiAgICAgIHRoaXMucHJlQ29tcG9uZW50cyA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyBwcmVUZW1wbGF0ZXNcbiAgICogQHBhcmFtICB7T2JqZWN0IG9mIFN0cmluZyBvciBPYmplY3R9IGZyb20gUHJlIHRlbXBsYXRlcyBiZWZvcmUgY29tcGlsYXRpb25cbiAgICogQHBhcmFtICB7U3RyaW5nfSBwcmVmaXggICAgICAgICAgICAgICAgICAgUHJlZml4IGlmIHRleHRzIHJlbGF0ZWQgdG8gY29tcG9uZW50XG4gICAqXG4gICAqIEB2YWxpZGF0aW9uIE5PVEU6IGFzc2VydHMgbWFkZSBpbiBgY29uY2F0VGV4dHNgIGFuZCBgYWRkYFxuICAgKi9cbiAgX3JlY29yZChmcm9tLCBwcmVmaXgpIHtcbiAgICAvKiogQHR5cGUge09iamVjdCBvZiBTdHJpbmcgb3IgT2JqZWN0fSBUaGUgY29udGFpbmVyIG9mIHJlY29yZGVkIHByZSB0ZW1wbGF0ZXMgKi9cbiAgICBsZXQgdG8gPSAocHJlZml4ID9cbiAgICAgICh0aGlzLnByZUNvbXBvbmVudHNbcHJlZml4XSB8fCAodGhpcy5wcmVDb21wb25lbnRzW3ByZWZpeF0gPSB7fSkpIDpcbiAgICAgIHRoaXMucHJlVGV4dHNcbiAgICApO1xuXG4gICAga2V5cyhmcm9tKS5mb3JFYWNoKGZ1bmN0aW9uKHRhZykge1xuICAgICAgbGV0IHRleHQgPSBmcm9tW3RhZ107XG5cbiAgICAgIHN3aXRjaCh0eXBlT2YodGV4dCkpIHtcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICBhc3NpZ24odG8sIHsgW3RhZ106IHRleHQgfSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICB0b1t0YWddID0gaXNPYmplY3QoZnJvbVt0YWddKSA/IGZyb21bdGFnXSA6IHt9O1xuXG4gICAgICAgICAga2V5cyh0ZXh0KS5mb3JFYWNoKGZ1bmN0aW9uKHRvLCBmcm9tLCB0YWcpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZnJvbVt0YWddO1xuXG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcodGV4dCkpIHtcbiAgICAgICAgICAgICAgYXNzaWduKHRvLCB7IFt0YWddOiB0ZXh0IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0uYmluZCh0aGlzLCB0b1t0YWddLCBmcm9tW3RhZ10pKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFkZChwcmVUZW1wbGF0ZXMsIHByZWZpeCA9ICcnKSB7XG4gICAgY29uc29sZS5hc3NlcnQoaXNPYmplY3QocHJlVGVtcGxhdGVzKSwgJ3ByZVRlbXBsYXRlcyBpcyBub3QgYSBzdHJpbmcnKTtcbiAgICBjb25zb2xlLmFzc2VydChpc1N0cmluZyhwcmVmaXgpLCAncHJlZml4IGlzIG5vdCBhIHN0cmluZycpO1xuXG4gICAgLyoqIFRleHRzIHRlbXBsYXRlcyAqL1xuICAgIGlmIChwcmVmaXgpIHtcbiAgICAgIGNvbnNvbGUuYXNzZXJ0KCEgKHByZWZpeCBpbiB0aGlzLmNvbXBvbmVudHMpLCAncHJlZml4IGFscmVhZHkgYXNzaWduZWQnKTtcblxuICAgICAgdGhpcy5jb21wb25lbnRzW3ByZWZpeF0gPSBMYW5ndWFnZS5jb25jYXRUZXh0cyh7fSwgcHJlVGVtcGxhdGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZXh0cyA9IExhbmd1YWdlLmNvbmNhdFRleHRzKHRoaXMudGV4dHMsIHByZVRlbXBsYXRlcyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuUkVDT1JEX1RFWFRTKSB7XG4gICAgICB0aGlzLl9yZWNvcmQocHJlVGVtcGxhdGVzLCBwcmVmaXgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAdG9kbyBtb2RpZnkoKSAqL1xuXG4gIGdldCh0ZXh0LCBwcmVmaXggPSAnJykge1xuICAgIGNvbnNvbGUuYXNzZXJ0KGlzU3RyaW5nKHRleHQpLCAndGV4dCBpcyBub3QgYSBzdHJpbmcnKTtcbiAgICBjb25zb2xlLmFzc2VydCh0ZXh0Lmxlbmd0aCA+IDAsICd0ZXh0IGlzIGVtcHR5Jyk7XG4gICAgY29uc29sZS5hc3NlcnQoaXNTdHJpbmcocHJlZml4KSwgJ3ByZWZpeCBpcyBub3QgYSBzdHJpbmcnKTtcblxuICAgIGlmIChwcmVmaXgubGVuZ3RoID4gMCkge1xuICAgICAgY29uc29sZS5hc3NlcnQocHJlZml4IGluIHRoaXMuY29tcG9uZW50cywgJ3ByZWZpeCBpcyBub3QgaW4gdGhpcy5jb21wb25lbnRzJyk7XG4gICAgICBjb25zb2xlLmFzc2VydCh0ZXh0IGluIHRoaXMuY29tcG9uZW50c1twcmVmaXhdLCAndGV4dCBpcyBpbiBub3QgaW4gdGhpcy5jb21wb25lbnRzLnByZWZpeCcpO1xuXG4gICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzW3ByZWZpeF1bdGV4dF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuYXNzZXJ0KHRleHQgaW4gdGhpcy50ZXh0cywgYCcke3RleHR9JyBpcyBpbiBub3QgaW4gdGhpcy50ZXh0c2ApO1xuXG4gICAgICByZXR1cm4gdGhpcy50ZXh0c1t0ZXh0XTtcbiAgICB9XG4gIH1cblxuICBnZXRSZWNvcmRzKCkge1xuICAgIGlmICghIHRoaXMuUkVDT1JEX1RFWFRTKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGV4dHM6IHRoaXMucHJlVGV4dHMsXG4gICAgICBjb21wb25lbnRzOiB0aGlzLnByZUNvbXBvbmVudHNcbiAgICB9O1xuICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgTGFuZ3VhZ2U7XG4iLCJpbXBvcnQgY291bnQgZnJvbSAnLi9ydW50aW1lL2NvdW50JztcbmltcG9ydCB0ZXh0IGZyb20gJy4vcnVudGltZS90ZXh0JztcbmltcG9ydCB0eXBlT2ZUZW1wbGF0ZSBmcm9tICcuL3V0aWxzL3R5cGUtb2YtdGVtcGxhdGUnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY291bnQsXG4gIHRleHQsXG4gIHR5cGVPZjogdHlwZU9mVGVtcGxhdGVcbn07XG4iLCJpbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nO1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4uL3RlbXBsYXRlJztcbmltcG9ydCBDT1VOVF9LRVlTIGZyb20gJy4uL2NvbnN0YW50cy9jb21waWxlLWNvdW50LWtleXMnO1xuaW1wb3J0IFBBUkFNX1JFR0VYIGZyb20gJy4uL2NvbnN0YW50cy9wYXJhbS1yZWdleCc7XG5pbXBvcnQgeyBpc09iamVjdCwgaXNTdHJpbmcsIGlzTnVtZXJpYywgaXNFbXB0eSB9IGZyb20gJy4uL3V0aWxzL3R5cGUtb2YnO1xuY29uc3QgeyBrZXlzIH0gPSBPYmplY3Q7XG5cbi8qKlxuICogQ29tcGlsZSB0ZXh0IHdpdGggYSBwYXJhbWV0ZXIgb2YgYW1vdW50IHRvIGEgdGVtcGxhdGUgZnVuY3Rpb25cbiAqIEBwYXJhbSAge1N0cmluZ30gdGV4dCAgICAgICAgU3RyaW5nIHRoYXQgbWF5IGNvbnRhaW4gcGFyYW1ldGVycyBpbnNpZGUgdGhlIHN0cmluZ1xuICogQHBhcmFtICB7UmVnRXhwfSBwYXJhbXNSZWdleCBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIGV4dHJhY3QgcGFyYW1ldGVyc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbnMgYW5kIG5hbWVzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gICAgICAgICAgIFRoZSB0ZW1wbGF0ZSBmdW5jdGlvblxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21waWxlQ291bnQodGV4dHMsIHBhcmFtc1JlZ2V4ID0gUEFSQU1fUkVHRVgpIHtcbiAgY29uc29sZS5hc3NlcnQoaXNPYmplY3QodGV4dHMpLCAndGV4dHMgaXNuXFwndCBhbiBvYmplY3QnKTtcbiAgY29uc29sZS5hc3NlcnQoISBpc0VtcHR5KHRleHRzKSwgJ3RleHRzIGlzIGFuIGVtcHR5IG9iamVjdCcpO1xuICBjb25zb2xlLmFzc2VydChrZXlzKHRleHRzKS5ldmVyeShrZXkgPT4gaXNTdHJpbmcodGV4dHNba2V5XSkpLCAndGV4dHMgY29udGFpbnMgbm9uZSBzdHJpbmcgb2JqZWN0Jyk7XG5cbiAgY29uc3QgdGV4dHNQYXJhbXNPYmplY3QgPVxuICAgIC8qKiBUYWtlcyBvdXQgdGhlIGtleXMgZm9yIGl0ZXJhdGlvbiAqL1xuICAgIGtleXModGV4dHMpXG4gICAgLyoqIENyZWF0ZXMgdGV4dHNQYXJhbXMgZm9yIGVhY2gga2V5ICovXG4gICAgLm1hcChrZXkgPT4gWyBrZXksIHRleHRzW2tleV0uc3BsaXQocGFyYW1zUmVnZXgpIF0pXG4gICAgLyoqIENvbnZlcnQgdGhlIGFycmF5IGJhY2sgdG8gb2JqZWN0ICovXG4gICAgLnJlZHVjZSgob2JqLCBhcnJheSkgPT4gYXNzaWduKG9iaiwgeyBbIGFycmF5WzBdIF06IGFycmF5WzFdIH0pLCB7fSk7XG5cblxuICByZXR1cm4gZnVuY3Rpb24gdGVtcGxhdGVXcmFwcGVyKGNvdW50LCAuLi5wYXJhbXMpIHtcbiAgICBjb25zb2xlLmFzc2VydChpc051bWVyaWMoY291bnQpLCAndGV4dHMgaXNuXFwndCBhIG51bWJlcicpO1xuXG4gICAgLyoqIEB0eXBlIHtBcnJheSBvZiBTdHJpbmd9IENoZWNrIGlmIHRoZSBmaXJzdCBhcmd1bWVudCBjb250YWlucyBhbiBhcnJheSBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiBzdHJpbmcgb3IgdGhlIHBhcmFtcyB0aGVtc2VsdmVzIGFyZSB0aGUgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Ygc3RyaW5nICovXG4gICAgY29uc3QgcGFyYW1zT2JqZWN0ID0gKHBhcmFtcy5sZW5ndGggJiYgISBpc1N0cmluZyhwYXJhbXNbMF0pID8gcGFyYW1zWzBdIDogcGFyYW1zKTtcbiAgICAvKiogQHR5cGUge09iamVjdCBvZiBTdHJpbmd9IFRoZSBvYmplY3Qgb2YgcGFyYW1zIHdpdGggdGhlIGNvdW50IHByb3BlcnR5ICovXG4gICAgY29uc3QgcGFyYW1zT2JqZWN0V2l0aENvdW50ID0gYXNzaWduKHt9LCBwYXJhbXNPYmplY3QsIHsgY291bnQ6IGNvdW50IH0pO1xuXG5cbiAgICAvKiogTk9ORSAqL1xuICAgIGlmIChjb3VudCA9PT0gMCAmJiAoQ09VTlRfS0VZUy5ub25lIGluIHRleHRzUGFyYW1zT2JqZWN0KSkge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlKHRleHRzUGFyYW1zT2JqZWN0Lm5vbmUsIHBhcmFtc09iamVjdFdpdGhDb3VudCk7XG4gICAgLyoqIFNJTkdMRSAqL1xuICAgIH0gZWxzZSBpZiAoY291bnQgPT09IDEgJiYgKENPVU5UX0tFWVMuc2luZ2xlIGluIHRleHRzUGFyYW1zT2JqZWN0KSkge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlKHRleHRzUGFyYW1zT2JqZWN0LnNpbmdsZSwgcGFyYW1zT2JqZWN0V2l0aENvdW50KTtcbiAgICAvKiogT1RIRVIgKi9cbiAgICB9IGVsc2UgaWYgKENPVU5UX0tFWVMub3RoZXIgaW4gdGV4dHNQYXJhbXNPYmplY3QpIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZSh0ZXh0c1BhcmFtc09iamVjdC5vdGhlciwgcGFyYW1zT2JqZWN0V2l0aENvdW50KTtcbiAgICB9XG5cblxuICAgIGNvbnNvbGUud2FybignVGhlcmUgaXMgbm8gbWF0Y2ggdGV4dHNQYXJhbXMgdG8gdGhlIGNvdW50Jyk7XG5cbiAgICByZXR1cm4gJyc7XG4gIH07XG59XG4iLCJpbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi4vdGVtcGxhdGUnO1xuaW1wb3J0IFBBUkFNX1JFR0VYIGZyb20gJy4uL2NvbnN0YW50cy9wYXJhbS1yZWdleCc7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL3V0aWxzL3R5cGUtb2YnO1xuXG4vKipcbiAqIENvbXBpbGUgdGV4dCB0byBhIHRlbXBsYXRlIGZ1bmN0aW9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHRleHQgICAgICAgIFN0cmluZyB0aGF0IG1heSBjb250YWluIHBhcmFtZXRlcnMgaW4gc3RyaW5nXG4gKiBAcGFyYW0gIHtSZWdFeHB9IHBhcmFtc1JlZ2V4IFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gZXh0cmFjdCBwYXJhbWV0ZXJzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9ucyBhbmQgbmFtZXNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAgICAgICAgICAgVGhlIHRlbXBsYXRlIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXBpbGVUZXh0KHRleHQsIHBhcmFtc1JlZ2V4ID0gUEFSQU1fUkVHRVgpIHtcbiAgY29uc29sZS5hc3NlcnQoaXNTdHJpbmcodGV4dCksICd0ZXh0IGlzblxcJ3QgYSBzdHJpbmcnKTtcblxuICBjb25zdCB0ZXh0c1BhcmFtcyA9IHRleHQuc3BsaXQocGFyYW1zUmVnZXgpO1xuXG4gIHJldHVybiBmdW5jdGlvbiB0ZW1wbGF0ZVdyYXBwZXIoLi4ucGFyYW1zKSB7XG4gICAgLyoqIEB0eXBlIHtBcnJheSBvZiBTdHJpbmd9IENoZWNrIGlmIHRoZSBmaXJzdCBhcmd1bWVudCBjb250YWlucyBhbiBhcnJheSBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiBzdHJpbmcgb3IgdGhlIHBhcmFtcyB0aGVtc2VsdmVzIGFyZSB0aGUgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Ygc3RyaW5nICovXG4gICAgY29uc3QgcGFyYW1zT2JqZWN0ID0gKHBhcmFtcy5sZW5ndGggJiYgISBpc1N0cmluZyhwYXJhbXNbMF0pID8gcGFyYW1zWzBdIDogcGFyYW1zKTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZSh0ZXh0c1BhcmFtcywgcGFyYW1zT2JqZWN0KTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IGlzQXJyYXksIGlzT2JqZWN0LCBpc1N0cmluZyB9IGZyb20gJy4vdXRpbHMvdHlwZS1vZic7XG5cbi8qKlxuICogVGFrZXMgYXJyYXkgb2YgdGV4dHMgYW5kIHByb3BlcnRpZXMgbmFtZXMnIGFuZCBwYXJhbWV0ZXJzIGFuZCByZXR1cm5zIGEgdGV4dFxuICogQHBhcmFtICB7QXJyYXkgb2YgU3RyaW5nfSB0ZXh0c1BhcmFtcyBBcnJheSBvZiB0ZXh0cyBhbmQgcGFyYW1ldGVycyBuYW1lc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdCBjb25zdHJ1Y3QgaW4gYSB3YXkgb2Y6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gZXZlbiBpbmRleGVzIGFyZSBwbGFpbiB0ZXh0IGFzIGlzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gb2RkIGluZGV4ZXMgYXJlIGtleSBuYW1lIGluIHBhcmFtc1xuICogQHBhcmFtICB7T2JqZWN0IG9mIFN0cmluZ30gcGFyYW1zICAgICBUaGUgcGFyYW1ldGVycyB2YWx1ZXNcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgVGhlIHRleHRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUodGV4dHNQYXJhbXMsIHBhcmFtcyA9IHt9KSB7XG4gIGNvbnNvbGUuYXNzZXJ0KGlzQXJyYXkodGV4dHNQYXJhbXMpLCAndGV4dHNQYXJhbXMgaXNuXFwndCBhbiBhcnJheScpO1xuICBjb25zb2xlLmFzc2VydCh0ZXh0c1BhcmFtcy5ldmVyeShpc1N0cmluZyksICd0ZXh0c1BhcmFtcyBpc25cXCd0IGFuIGFycmF5IG9mIHN0cmluZ3MnKTtcbiAgY29uc29sZS5hc3NlcnQoaXNBcnJheShwYXJhbXMpIHx8IGlzT2JqZWN0KHBhcmFtcyksICdwYXJhbXMgaXNuXFwndCBhbiBhcnJheSBvciBvYmplY3QnKTtcblxuXG4gIHJldHVybiB0ZXh0c1BhcmFtcy5tYXAoKGtleSwgaW5kZXgpID0+IHtcbiAgICAvKiogSWYga2V5IGlzIGEgcGxhaW4gdGV4dC4gKGV2ZW4gaW5kZXhlcykgKi9cbiAgICBpZiAoaW5kZXggJSAyID09PSAwKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIC8qKiBJZiBrZXkgaXMgZm9yIHByb3BlcnR5IG5hbWUuIChvZGQgaW5kZXhlcykgKi9cbiAgICBjb25zb2xlLmFzc2VydChrZXkgIT09ICcnLCBgdGV4dHNQYXJhbXNbJHtpbmRleH1dIGlzIGFuIGVtcHR5IHN0cmluZ2ApO1xuXG4gICAgcmV0dXJuIGtleSBpbiBwYXJhbXMgPyBwYXJhbXNba2V5XSA6ICcnO1xuICB9KS5qb2luKCcnKTtcbn1cbiIsImltcG9ydCB7IGlzRW1wdHksIGlzU3RyaW5nIH0gZnJvbSAnLi90eXBlLW9mJztcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVFbnVtKC4uLnBhcmFtcykge1xuICBjb25zb2xlLmFzc2VydCghIGlzRW1wdHkocGFyYW1zKSwgJ3BhcmFtcyBhcmUgZW1wdHknKTtcblxuXG4gIGxldCBvYmogPSB7fTtcblxuICBwYXJhbXMuZm9yRWFjaChmdW5jdGlvbihwYXJhbSkge1xuICAgIGNvbnNvbGUuYXNzZXJ0KGlzU3RyaW5nKHBhcmFtKSwgJ3BhcmFtIGlzIG5vdCBhIHN0cmluZycpO1xuICAgIGNvbnNvbGUuYXNzZXJ0KCEgaXNFbXB0eShwYXJhbSksICdwYXJhbSBpcyBlbXB0eScpO1xuXG4gICAgb2JqW3BhcmFtXSA9IHBhcmFtO1xuICB9KTtcblxuICByZXR1cm4gb2JqO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgaXNGaW5pdGU7XG4iLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlTm9vcCgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG5vb3AoKSB7fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm9vcCgpIHt9XG4iLCIvKipcbiAqIFNob3J0Y3V0IHRvIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGxgXG4gKiBAcGFyYW0gIHtPYmplY3R9IHhcbiAqIEByZXR1cm4ge1N0cmluZ30gICBUaGUgdHlwZSBvZiBvYmplY3RcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gT2JqZWN0VG9TdHJpbmcoeCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpO1xufVxuIiwiaW1wb3J0IHsgaXNTdHJpbmcsIGlzT2JqZWN0LCBpc0VtcHR5IH0gZnJvbSAnLi90eXBlLW9mJztcbi8vIGltcG9ydCBjb3VudEVudW0gZnJvbSAnLi4vY29uc3RhbnRzLycgLy8gZm9yIGZ1dHVyZSBkZWVwIGNoZWNraW5nXG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBleHBlY3RlZCB0ZW1wbGF0ZSBjb21wYXJpbmcgdGhlIG9iamVjdC5cbiAqIE5PVEU6IHJpZ2h0IG5vdyB0aGVyZSBhcmUgb25seSB0d28gdHlwZXMgb2YgdGVtcGxhdGVzICh0ZXh0LCBjb3VudClcbiAqICAgICAgIHNvIHRoZXJlIGlzIG5vIGRlZXAgdGVzdGluZ1xuICogTk9URTogaXQgYWxzbyBvbmx5IGRldGVjdCBzdHJ1Y3R1cmUsIG5vdCB0aGUgY29udGVudC4gU28gaXQgZG9lc24ndCBtYXR0ZXJcbiAqICAgICAgIGlmIGl0J3MgYSBwcmUgdGVtcGxhdGUgb3IgY29tcGlsZWQgb25lLlxuICpcbiAqIEBwYXJhbSAge09iamVjdCBvciBTdHJpbmd9IG9iaiBUaGUgdGV4dC9zIHRoYXQgc3VwcG9zZWQgdG8gYmUgY29udmVydGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAgVGhlIHR5cGUgb2YgdGVtcGxhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHlwZU9mVGVtcGxhdGUob2JqKSB7XG4gIGNvbnNvbGUuYXNzZXJ0KCEgaXNFbXB0eShvYmopLCAndGVtcGxhdGUgY2Fubm90IGJlIGVtcHR5Jyk7XG5cbiAgaWYgKGlzU3RyaW5nKG9iaikpIHtcbiAgICByZXR1cm4gJ3RleHQnO1xuICB9XG5cbiAgaWYgKGlzT2JqZWN0KG9iaikpIHtcbiAgICByZXR1cm4gJ2NvdW50JztcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gdHlwZSBvZiB0ZW1wbGF0ZScpO1xufVxuIiwiLyoqXG4gKiBHZXQgdGhlIHR5cGUgb2YgdmFyaWFibGUuXG4gKiBiYXNlZCBvbiBFbWJlci9NZXRhbC9VdGlscy90eXBlT2ZcbiAqXG4gKiBAc3VwcG9ydCBFUzUrXG4gKi9cbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgeyBjcmVhdGVOb29wIH0gZnJvbSAnLi9ub29wJztcbmltcG9ydCBvYmplY3RUb1N0cmluZyBmcm9tICcuL29iamVjdC10by1zdHJpbmcnO1xuaW1wb3J0IG5hdGl2ZUlzRmluaXRlIGZyb20gJy4vbmF0aXZlLWlzLWZpbml0ZSc7XG5cbi8qKiBAdHlwZSB7QXJyYXkgb2YgU3RyaW5nfSBTdXBwb3J0ZWQgdHlwZXMgZGV0ZWN0aW9uICovXG5jb25zdCBTVVBQT1JURURfVFlQRVMgPSBbJ0Jvb2xlYW4nLCAnTnVtYmVyJywgJ1N0cmluZycsICdGdW5jdGlvbicsICdBcnJheScsICdEYXRlJywgJ1JlZ0V4cCcsICdPYmplY3QnLCAnRXJyb3InXTtcbi8qKiBAdHlwZSB7T2JqZWN0IG9mIFN0cmluZ30gTWFwIG9mIHR5cGVzIGFuZCB0byByZXR1cm5lZCB2YWx1ZSBmcm9tIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYCAqL1xuY29uc3QgVFlQRV9NQVAgPSBTVVBQT1JURURfVFlQRVNcbiAgICAucmVkdWNlKCh4LCB5KSA9PiBhc3NpZ24oeCwgeyBbYFtvYmplY3QgJHt5fV1gXTogeS50b0xvd2VyQ2FzZSgpIH0pLCB7fSk7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHgpIHtcbiAgcmV0dXJuIHggPT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh4KSB7XG4gIHJldHVybiB4ID09PSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCb29sZWFuKHgpIHtcbiAgcmV0dXJuIHggPT09IHRydWUgfHwgeCA9PT0gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KHgpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoeCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh4KSB7XG4gIHJldHVybiBvYmplY3RUb1N0cmluZyh4KSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgdmFyIHVpbnQ4YSA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBjcmVhdGVOb29wKCk7XG5cbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nICYmICghICh4IGluc3RhbmNlb2YgdWludDhhKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGUoeCkge1xuICAvLyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoL2Jsb2IvZXM2L2xhbmcvaXNEYXRlLmpzXG4gIHJldHVybiBvYmplY3RUb1N0cmluZyh4KSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIoeCkge1xuICByZXR1cm4gKHR5cGVvZiB4ID09PSAnbnVtYmVyJykgfHwgKG9iamVjdFRvU3RyaW5nKHgpID09PSAnW29iamVjdCBOdW1iZXJdJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05hTih4KSB7XG4gIGlmIChOdW1iZXIuaU5hTikge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oeCk7XG4gIH1cblxuICAvLyBiYXNlZCBvbjogaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2gvYmxvYi9lczYvbGFuZy9pc05hTi5qc1xuICByZXR1cm4gaXNOdW1iZXIoeCkgJiYgeCAhPT0gTnVtYmVyKHgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGaW5pdGUoeCkge1xuICBpZiAoTnVtYmVyLmlzRmluaXRlKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZSh4KTtcbiAgfVxuXG4gIC8vIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaC9ibG9iL2VzNi9sYW5nL2lzRmluaXRlLmpzXG4gIHJldHVybiBuYXRpdmVJc0Zpbml0ZSh4KSAmJiBpc051bWJlcih4KTtcbn1cblxuLyoqIEVTNiBgaXNGaW5pdGVgIGRvZXMgdGhlIHNhbWUgdGhpbmcgKi9cbmV4cG9ydCB2YXIgaXNOdW1lcmljID0gaXNGaW5pdGU7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyh4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ3N0cmluZycgfHwgb2JqZWN0VG9TdHJpbmcoeCkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOb25lKHgpIHtcbiAgcmV0dXJuIGlzVW5kZWZpbmVkKHgpIHx8IGlzTnVsbCh4KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRW1wdHkoeCkge1xuICBpZiAoaXNOb25lKHgpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoaXNOYU4oeCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KHgpICYmIHgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoaXNPYmplY3QoeCkgJiYgT2JqZWN0LmtleXMoeCkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoaXNTdHJpbmcoeCkgJiYgeC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHlwZU9mKHgpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHgpKSB7XG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuICB9XG5cbiAgaWYgKGlzTnVsbCh4KSkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cblxuICBpZiAoaXNGdW5jdGlvbih4KSkge1xuICAgIHJldHVybiAnZnVuY3Rpb24nO1xuICB9XG5cbiAgLyoqIEB0eXBlIHtTdHJpbmd9IElmIGRpZG4ndCBwYXNzIHRoZSBjdXN0b20gdGVzdHMgKi9cbiAgbGV0IHR5cGUgPSBvYmplY3RUb1N0cmluZyh4KTtcblxuICAvKiogVGhlIGZhbGxiYWNrIGlzIGFsd2F5cyBgb2JqZWN0YCAqL1xuICByZXR1cm4gKHR5cGUgaW4gVFlQRV9NQVApID8gVFlQRV9NQVBbdHlwZV0gOiAnb2JqZWN0Jztcbn1cbiJdfQ==
