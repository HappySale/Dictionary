/** related to module: utils/type-of */
import { expect } from 'chai';
import typeOf from '../src/utils/type-of';


describe('utils/typeOf', function() {
  describe('typeOf.isUndefined()', function() {
    let { isUndefined } = typeOf;

    it('should return true', function () {
      expect(isUndefined(undefined)).to.true();
    });

    it('should return false', function () {
      expect(isUndefined(null)).to.false();
      expect(isUndefined({})).to.false();
      expect(isUndefined(() => undefined)).to.false();
    });
  });

  describe('typeOf.isNull()', function() {
    let { isNull } = typeOf;

    it('should return true', function () {
      expect(isNull(null)).to.true();
    });

    it('should return false', function () {
      expect(isNull(undefined)).to.false();
      expect(isNull({})).to.false();
      expect(isNull([null])).to.false();
      expect(isNull(() => null)).to.false();
    });
  });

  describe('typeOf.isBoolean()', function() {
    let { isBoolean } = typeOf;

    it('should return true', function () {
      expect(isBoolean(true)).to.true();
      expect(isBoolean(false)).to.true();
    });

    it('should return false', function () {
      expect(isBoolean('true')).to.false();
      expect(isBoolean('false')).to.false();
      expect(isBoolean(0)).to.false();
      expect(isBoolean(1)).to.false();
      expect(isBoolean(null)).to.false();
      expect(isBoolean(undefined)).to.false();
    });
  });

  describe('typeOf.isArray()', function() {
    let { isArray } = typeOf;

    it('should return true', function () {
      expect(isArray([])).to.true();
      expect(isArray([1, 2])).to.true();
    });

    it('should return false', function () {
      expect(isArray(undefined)).to.false();
      expect(isArray(null)).to.false();
      expect(isArray({ '0': 0, 'length': 1 })).to.false();
    });
  });

  describe('typeOf.isObject()', function() {
    let { isObject } = typeOf;

    it('should return true', function () {
      expect(isObject({})).to.true();
    });

    it('should return false', function () {
      expect(isObject(() => undefined)).to.false();
      expect(isObject(new Date())).to.false();
      expect(isObject([])).to.false();
      expect(isObject(undefined)).to.false();
      expect(isObject(null)).to.false();
      expect(isObject('string')).to.false();
      expect(isObject(0)).to.false();
    });
  });

  describe('typeOf.isFunction()', function() {
    let { isFunction } = typeOf;

    it('should return true', function () {
      expect(isFunction(Object.prototype.toString)).to.true();
      expect(isFunction(() => undefined)).to.true();
    });

    it('should return false', function () {
      expect(isFunction(new Uint8Array())).to.false();
      expect(isFunction({})).to.false();
      expect(isFunction([])).to.false();
      expect(isFunction(undefined)).to.false();
      expect(isFunction(null)).to.false();
      expect(isFunction(0)).to.false();
      expect(isFunction('string')).to.false();
      expect(isFunction(/a/)).to.false();
    });
  });

  describe('typeOf.isDate()', function() {
    let isDate = typeOf.isDate;

    it('should return true', function () {
      expect(isDate(new Date())).to.true();
    });

    it('should return false', function () {
      expect(isDate(null)).to.false();
      expect(isDate(undefined)).to.false();
      expect(isDate('2014-12-12')).to.false();
      expect(isDate('Wed Jan 21 2015 11:14:02 GMT+0200 (IST)')).to.false();
      expect(isDate('2015-01-21T09:14:25.222Z')).to.false();
      expect(isDate({})).to.false();
    });
  });

  describe('typeOf.isNaN()', function() {
    let _isNaN = typeOf.isNaN;

    it('should return true', function () {
      expect(_isNaN(NaN)).to.true();
    });

    it('should return false', function () {
      expect(_isNaN(1)).to.false();
      expect(_isNaN(0)).to.false();
      expect(_isNaN(-0)).to.false();
      expect(_isNaN(Infinity)).to.false();
    });
  });

  describe('typeOf.isNumber()', function() {
    let isNumber = typeOf.isNumber;

    it('should return true', function () {
      expect(isNumber(NaN)).to.true();
      expect(isNumber(1)).to.true();
      expect(isNumber(0)).to.true();
      expect(isNumber(-0)).to.true();
      expect(isNumber(Infinity)).to.true();
      expect(isNumber(-Infinity)).to.true();
    });

    it('should return false', function () {
      expect(isNumber(null)).to.false();
      expect(isNumber(undefined)).to.false();
      expect(isNumber('1')).to.false();
      expect(isNumber([1])).to.false();
    });
  });

  describe('typeOf.isFinite()', function() {{
    let _isFinite = typeOf.isFinite;

    it('should return true', function () {
      expect(_isFinite(1)).to.true();
      expect(_isFinite(0)).to.true();
      expect(_isFinite(-0)).to.true();
    });

    it('should return false', function () {
      expect(_isFinite(NaN)).to.false();
      expect(_isFinite(Infinity)).to.false();
      expect(_isFinite(-Infinity)).to.false();
      expect(_isFinite(null)).to.false();
      expect(_isFinite(undefined)).to.false();
      expect(_isFinite('1')).to.false();
      expect(_isFinite([1])).to.false();
    });
  }});

  describe('typeOf.isNumeric()', function() {
    it('should be equal to isFinite', function() {
      expect(typeOf.isNumeric).to.equal(typeOf.isFinite);
    });
  });

  describe('typeOf.isString()', function() {
    let isString = typeOf.isString;

    it('should return true', function () {
      expect(isString('')).to.true();
      expect(isString('null')).to.true();
    });

    it('should return false', function () {
      expect(isString(NaN)).to.false();
      expect(isString(1)).to.false();
      expect(isString(Infinity)).to.false();
      expect(isString(-Infinity)).to.false();
      expect(isString(null)).to.false();
      expect(isString(undefined)).to.false();
      expect(isString({})).to.false();
      expect(isString([])).to.false();
      expect(isString(function() {})).to.false();
      expect(isString(new Date())).to.false();
    });
  });

  describe('typeOf.isNone()', function() {
    let { isNone } = typeOf;

    it('should return true', function () {
      expect(isNone(null)).to.true();
      expect(isNone(undefined)).to.true();
    });

    it('should return false', function () {
      expect(isNone('')).to.false();
      expect(isNone(false)).to.false();
      expect(isNone(0)).to.false();
      expect(isNone({})).to.false();
      expect(isNone([null])).to.false();
      expect(isNone(() => null)).to.false();
    });
  });

  describe('typeOf()', function() {
    it('return undefined for undefined', function () {
      expect(typeOf(undefined)).to.equal('undefined');
    });

    it('return null for null', function () {
      expect(typeOf(null)).to.equal('null');
    });

    it('return string for string', function () {
      expect(typeOf('null')).to.equal('string');
      expect(typeOf('true')).to.equal('string');
    });

    it('return boolean for boolean', function () {
      expect(typeOf(false)).to.equal('boolean');
      expect(typeOf(true)).to.equal('boolean');
    });

    it('return function for function', function () {
      expect(typeOf(function() {})).to.equal('function');
    });

    it('return regexp for regexp', function () {
      expect(typeOf(/a/)).to.equal('regexp');
    });

    it('return array for array', function () {
      expect(typeOf([])).to.equal('array');
    });

    it('return date for date', function () {
      expect(typeOf(new Date())).to.equal('date');
    });

    it('return error for error', function () {
      expect(typeOf(new Error('error'))).to.equal('error');
      expect(typeOf(new TypeError('error'))).to.equal('error');
    });

    it('return object for object', function () {
      var FakeClass = function() {};

      expect(typeOf({})).to.equal('object');
      expect(typeOf(new FakeClass())).to.equal('object');
    });
  });

  describe('typeOf.isEmpty()', function() {
    let { isEmpty } = typeOf;

    it('should return true', function () {
      expect(isEmpty(undefined)).to.true();
      expect(isEmpty(null)).to.true();
      expect(isEmpty([])).to.true();
      expect(isEmpty({})).to.true();
      expect(isEmpty('')).to.true();
      expect(isEmpty(NaN)).to.true();
    });

    it('should return false', function () {
      expect(isEmpty([0])).to.false();
      expect(isEmpty(0)).to.false();
      expect(isEmpty(' ')).to.false();
      expect(isEmpty(new Date())).to.false();
      expect(isEmpty({ 'length': 0 })).to.false();
      expect(isEmpty(function() {})).to.false();
    });
  });
});
