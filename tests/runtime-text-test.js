/** related to module: runtime/text */
import { expect } from 'chai';
/** Chai doesn't have `except.to.be.function` */
import { isFunction } from '../src/utils/type-of';
import runtimeText from '../src/runtime/text';


describe('runtime/text', function() {
  describe('params that makes it fail', function() {
    it('should throw for no arguments', function() {
      expect(runtimeText).to.throw();
    });
  });

  describe('compiling template function', function() {
    it('should return a function for an empty string', function() {
      let template = runtimeText('');
      expect(isFunction(template)).to.be.true();
    });

    it('should return a function for a string', function() {
      let template = runtimeText('hello {{0}}');

      expect(isFunction(template)).to.be.true();
    });
  });

  describe('template results with empty params', function() {
    it('should have a function that returns an empty string', function() {
      let template = runtimeText(''),
        result = template([]);

      expect(result).to.equal('');
    });

    it('should have a function that returns `hello`', function() {
      let template = runtimeText('hello'),
        result = template([]);

      expect(result).to.equal('hello');
    });
  });

  describe('template results with params', function() {
    it('it shoud runtime `hello world`', function() {
      let template = runtimeText('hello {{0}}'),
        result = template({ '0': 'world' });
      expect(result).to.equal('hello world');
    });
  });
});
