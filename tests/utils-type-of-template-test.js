/** related to module: runtime/type-of-template */
import { expect } from 'chai';
/** Chai doesn't have `except.to.be.function` */
import { isFunction } from '../src/utils/type-of';
import typeOfTemplate from '../src/utils/type-of-template';


describe('utils/typeOfTemplate', function() {
  describe('it exists', function() {
    it('should be a function', function() {
      expect(isFunction(typeOfTemplate)).to.true();
    });
  });

  describe('type errors tests', function() {
    it('should throw to undefined', function() {
      expect(typeOfTemplate).to.throw();
    });

    it('should throw to null', function() {
      expect(() => typeOfTemplate(null)).to.throw();
    });

    it('should throw to numbers', function() {
      expect(() => typeOfTemplate(1)).to.throw();
      expect(() => typeOfTemplate(NaN)).to.throw();
    });

    it('should throw to arrays', function() {
      expect(() => typeOfTemplate([1, 2])).to.throw();
    });

    it('should throw to empty objects', function() {
      expect(() => typeOfTemplate([])).to.throw();
      expect(() => typeOfTemplate('')).to.throw();
      expect(() => typeOfTemplate({})).to.throw();
    });
  });

  describe('detection of text templates', function() {
    it('should detect a text template', function() {
      let result = typeOfTemplate('mock of text template');

      expect(result).to.equal('text');
    });
  });

  describe('detection of count templates', function() {
    it('should detect a count template', function() {
      let result = typeOfTemplate({ other:'mock of text template' });

      expect(result).to.equal('count');
    });
  });
});
