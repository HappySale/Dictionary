/** related to module: utils/create-enum */
import { expect } from 'chai';
import createEnum from '../src/utils/create-enum';
/** Chai doesn't have `except.to.be.object` */
import { isObject } from '../src/utils/type-of';


describe('utils/create-enum', function() {
  describe('no arguments', function() {
    it('should fail', function() {
      expect(createEnum).to.throw();
    });
  });

  describe('empty string arguments', function() {
    it('should fail for empty string', function() {
      expect(createEnum.bind(null, '')).to.throw();
      expect(createEnum.bind(null, 'a', '')).to.throw();
      expect(createEnum.bind(null, 'a', '', 'b')).to.throw();
    });
  });

  describe('none string parameters', function() {
    it('should fail for number', function() {
      expect(createEnum.bind(null, 1)).to.throw();
    });

    it('should fail for an object', function() {
      expect(createEnum.bind(null, {})).to.throw();
    });

    it('should fail for an array', function() {
      expect(createEnum.bind(null, [])).to.throw();
    });

    it('should fail for an boolean', function() {
      expect(createEnum.bind(null, true)).to.throw();
    });

    it('should fail for a date object', function() {
      expect(createEnum.bind(null, new Date())).to.throw();
    });
  });

  describe('valid string parameters', function() {
    it('should return an object', function() {
      expect(isObject(createEnum('a'))).to.be.true();
    });

    it('should return an object with key match value', function() {
      let e = createEnum('aKey');

      expect(Object.keys(e).length).to.equal(1);
      expect(e.aKey).to.equal('aKey');
    });

    it('should return an object with keys match values', function() {
      let e = createEnum('a', 'b', 'c');

      expect(Object.keys(e).length).to.be.equal(3);
      expect(e.a).to.be.equal('a');
      expect(e.b).to.be.equal('b');
      expect(e.c).to.be.equal('c');
    });
  });
});
