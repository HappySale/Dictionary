!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Dictionary=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var isString = require("./utils/type-of").isString;
var isNone = require("./utils/type-of").isNone;
var Language = _interopRequire(require("./language"));

var Dictionary = (function () {
  function Dictionary() {
    var currentLanguage = arguments[0] === undefined ? "en" : arguments[0];
    this.languages = {};

    this.setCurrentLanguage(currentLanguage);
  }

  _prototypeProperties(Dictionary, null, {
    getCurrentLanguage: {
      value: function getCurrentLanguage() {
        return this.currentLanguage;
      },
      writable: true,
      enumerable: true,
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
      enumerable: true,
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
      enumerable: true,
      configurable: true
    },
    addLanguage: {
      value: function addLanguage(languageCode) {
        console.assert(!(languageCode in this.languages), "'" + languageCode + "' is already exists in languages");

        this.languages[languageCode] = new Language(languageCode);
      },
      writable: true,
      enumerable: true,
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
      enumerable: true,
      configurable: true
    },
    t: {
      value: function t(text, prefix) {
        for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          params[_key - 2] = arguments[_key];
        }

        var activeDictionary = this.getLanguage(),
            template = activeDictionary.get(text, prefix);

        return template(params);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    c: {
      value: function c(text, prefix, count) {
        for (var _len2 = arguments.length, params = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
          params[_key2 - 3] = arguments[_key2];
        }

        var activeDictionary = this.getLanguage(),
            template = activeDictionary.get(text, prefix);

        return template(count, params);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    gt: {

      /** Shortcut to `t` with no prefix */
      value: function gt(text) {
        var _ref;
        for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          params[_key3 - 1] = arguments[_key3];
        }

        return (_ref = this).t.apply(_ref, [text, ""].concat(_toArray(params)));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    gc: {

      /** Shortcut to `c` with no prefix */
      value: function gc(text, count) {
        var _ref2;
        for (var _len4 = arguments.length, params = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
          params[_key4 - 2] = arguments[_key4];
        }

        return (_ref2 = this).c.apply(_ref2, [text, "", count].concat(_toArray(params)));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    getShortcuts: {

      /** For server side use to inject template functions */
      value: function getShortcuts() {
        return {
          lang: this.setCurrentLanguage.bind(this),
          t: this.t.bind(this),
          c: this.c.bind(this),
          gt: this.gt.bind(this),
          gc: this.gc.bind(this)
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Dictionary;
})();

module.exports = Dictionary;

},{"./language":5,"./utils/type-of":15}],2:[function(require,module,exports){
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

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var createEnum = _interopRequire(require("../utils/create-enum"));




var KEYS = createEnum("none", "single", "other");

module.exports = KEYS;

},{"../utils/create-enum":10}],4:[function(require,module,exports){
"use strict";

var PARAM_REGEX = /(?:{{)([0-9A-Za-z]+)(?:}})/g;

module.exports = PARAM_REGEX;

},{}],5:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var assign = _interopRequire(require("object-assign"));

var runtime = _interopRequire(require("./runtime"));

var isString = require("./utils/type-of").isString;
var isObject = require("./utils/type-of").isObject;
var keys = Object.keys;
var Language = (function () {
  function Language() {
    this.texts = {};
    this.components = {};
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

          this[key] = runtime[runtime.typeOf(preTemplate)](preTemplate);
        }, newContext);

        return newContext;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
    add: {
      value: function add(preTemplates) {
        var prefix = arguments[1] === undefined ? "" : arguments[1];
        console.assert(isObject(preTemplates), "preTemplates is not a string");
        console.assert(isString(prefix), "prefix is not a string");

        /** Texts templates */
        if (prefix) {
          console.assert(!(prefix in this.components), "prefix already assigned");

          this.components[prefix] = Language.concatTexts(this.texts, preTemplates);
        } else {
          this.texts = Language.concatTexts(this.texts, preTemplates);
        }
      },
      writable: true,
      enumerable: true,
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
      enumerable: true,
      configurable: true
    }
  });

  return Language;
})();

module.exports = Language;

},{"./runtime":6,"./utils/type-of":15,"object-assign":2}],6:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var count = _interopRequire(require("./runtime/count"));

var text = _interopRequire(require("./runtime/text"));

var typeOfTemplate = _interopRequire(require("./utils/type-of-template"));

module.exports = {
  count: count,
  text: text,
  typeOf: typeOfTemplate
};

},{"./runtime/count":7,"./runtime/text":8,"./utils/type-of-template":14}],7:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) {
  return Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: true
  });
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

module.exports = compileCount;
var assign = _interopRequire(require("object-assign"));

var template = _interopRequire(require("../template"));

var COUNT_KEYS = _interopRequire(require("../constants/compile-count-keys"));

var PARAM_REGEX = _interopRequire(require("../constants/param-regex"));

var isObject = require("../utils/type-of").isObject;
var isString = require("../utils/type-of").isString;
var isNumeric = require("../utils/type-of").isNumeric;
var isEmpty = require("../utils/type-of").isEmpty;
var keys = Object.keys;


/**
 * Compile text with a parameter of amount to a template function
 * @param  {String} text        String that may contain parameters inside the string
 * @param  {RegExp} paramsRegex The regular expression to extract parameters
 *                              locations and names
 * @return {Function}           The template function
 */
function compileCount(texts) {
  var paramsRegex = arguments[1] === undefined ? PARAM_REGEX : arguments[1];
  return (function () {
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
  })();
}

},{"../constants/compile-count-keys":3,"../constants/param-regex":4,"../template":9,"../utils/type-of":15,"object-assign":2}],8:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

module.exports = compileText;
var template = _interopRequire(require("../template"));

var PARAM_REGEX = _interopRequire(require("../constants/param-regex"));

var isString = require("../utils/type-of").isString;


/**
 * Compile text to a template function
 * @param  {String} text        String that may contain parameters in string
 * @param  {RegExp} paramsRegex The regular expression to extract parameters
 *                              locations and names
 * @return {Function}           The template function
 */
function compileText(text) {
  var paramsRegex = arguments[1] === undefined ? PARAM_REGEX : arguments[1];
  return (function () {
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
  })();
}

},{"../constants/param-regex":4,"../template":9,"../utils/type-of":15}],9:[function(require,module,exports){
"use strict";

module.exports = template;
var isArray = require("./utils/type-of").isArray;
var isObject = require("./utils/type-of").isObject;
var isString = require("./utils/type-of").isString;


/**
 * Takes array of texts and properties names' and parameters and returns a text
 * @param  {Array of String} textsParams Array of texts and parameters names
 *                                       it construct in a way of:
 *                                       - even indexes are plain text as is
 *                                       - odd indexes are key name in params
 * @param  {Object of String} params     The parameters values
 * @return {String}                      The text
 */
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

},{"./utils/type-of":15}],10:[function(require,module,exports){
"use strict";

module.exports = createEnum;
var isEmpty = require("./type-of").isEmpty;
var isString = require("./type-of").isString;
function createEnum() {
  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  console.assert(!isEmpty(params), "params are empty");


  var obj = {};

  for (var _iterator = params[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
    var param = _step.value;
    console.assert(isString(param), "param is not a string");
    console.assert(!isEmpty(param), "param is empty");

    obj[param] = param;
  }

  return obj;
}

},{"./type-of":15}],11:[function(require,module,exports){
"use strict";

module.exports = isFinite;

},{}],12:[function(require,module,exports){
"use strict";

exports = module.exports = noop;
exports.create = create;
function create() {
  return function noop() {};
}

function noop() {}

},{}],13:[function(require,module,exports){
"use strict";

module.exports = ObjectToString;
/**
 * Shortcut to `Object.prototype.toString.call`
 * @param  {Object} x
 * @return {String}   The type of object
 */
function ObjectToString(x) {
  return Object.prototype.toString.call(x);
}

},{}],14:[function(require,module,exports){
"use strict";

module.exports = typeOfTemplate;
var isString = require("./type-of").isString;
var isObject = require("./type-of").isObject;
var isEmpty = require("./type-of").isEmpty;
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

},{"./type-of":15}],15:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) {
  return Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: true
  });
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

exports = module.exports = typeOf;
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
/**
 * Get the type of variable.
 * based on Ember/Metal/Utils/typeOf
 *
 * @support ES5+
 */
var assign = _interopRequire(require("object-assign"));

var noop = _interopRequire(require("./noop"));

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
  var uint8a = typeof Uint8Array !== "undefined" ? Uint8Array : noop.create();

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

},{"./native-is-finite":11,"./noop":12,"./object-to-string":13,"object-assign":2}]},{},[1])(1)
});