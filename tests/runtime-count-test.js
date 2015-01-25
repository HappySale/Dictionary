/** related to module: runtime/count */
import { expect } from 'chai';
/** Chai doesn't have `except.to.be.function` */
import { isFunction } from '../src/utils/type-of';
import runtimeCount from '../src/runtime/count';


describe('runtime/count', function() {
  describe('params that makes it fail', function() {
    it('should throw for no arguments', function() {
      expect(runtimeCount).to.throw();
    });

    it('should throw for empty texts', function() {
      expect(runtimeCount.bind(null, {})).to.throw();
    });
  });

  describe('compiling template function', function() {
    it('should return a function for an empty string', function() {
      let template = runtimeCount({ other: '' });
      expect(isFunction(template)).to.be.true();
    });

    it('should return a function for a string', function() {
      let template = runtimeCount({ other: 'counter' });

      expect(isFunction(template)).to.be.true();
    });
  });

  describe('template results with empty parameters', function() {
    it('should have a function that returns an empty string', function() {
      let template = runtimeCount({ other: ''}),
        result = template(1);

      expect(result).to.equal('');
    });

    it('should have a function that returns a `hello world`', function() {
      let template = runtimeCount({ other: 'hello world' });

      expect(template(0)).to.equal('hello world');
      expect(template(1)).to.equal('hello world');
      expect(template(10)).to.equal('hello world');
    });
  });

  describe('template results with parameters', function() {
    it('should have a function that returns a `hello bob!`', function() {
      let template = runtimeCount({ other: 'hello {{0}}!' });

      expect(template(0,  'bob')).to.equal('hello bob!');
      expect(template(1,  'bob')).to.equal('hello bob!');
      expect(template(10, 'bob')).to.equal('hello bob!');
    });
  });

  describe('template render count', function() {
    let template = runtimeCount({ other: '$${{count}}$$' });

    it('should render `$$0$$` for count equal to 0', function() {
      expect(template(0)).to.equal('$$0$$');
    });

    it('should render `$$-1$$` for count equal to -1', function() {
      expect(template(-1)).to.equal('$$-1$$');
    });

    it('should render `$$1$$` for count equal to 1', function() {
      expect(template(1)).to.equal('$$1$$');
    });

    it('should render `$$1234$$` for count equal to 1234', function() {
      expect(template(1234)).to.equal('$$1234$$');
    });
  });

  describe('template width a different results by count with no parameters', function() {
    let template = runtimeCount({
      none: 'empty',
      single: 'singular',
      other: 'plural'
    });

    it('should resolve `empty` for count equal 0', function() {
      expect(template(0)).to.equal('empty');
    });

    it('should resolve `singular` for count equal 1', function() {
      expect(template(1)).to.equal('singular');
    });

    it('should resolve `plural` for count not equal to 0 or 1', function() {
      expect(template(-1)).to.equal('plural');
      expect(template(2)).to.equal('plural');
      expect(template(10)).to.equal('plural');
    });
  });

  describe('template width a different results by count with parameters', function() {
    let template = runtimeCount({
      none: 'empty {{0}} empty',
      single: 'singular {{0}} singular',
      other: 'plural {{0}} plural'
    });

    it('should resolve `empty  empty` for count equal 0', function() {
      expect(template(0)).to.equal('empty  empty');
    });

    it('should resolve `empty hi empty` for count equal 0 and by first parameter', function() {
      expect(template(0, 'hi')).to.equal('empty hi empty');
    });

    it('should resolve `singular  singular` for count equal 1', function() {
      expect(template(1)).to.equal('singular  singular');
    });

    it('should resolve `singular hi singular` for count equal 1 and by first parameter', function() {
      expect(template(1, 'hi')).to.equal('singular hi singular');
    });

    it('should resolve `plural  plural` for count not equal to 0 or 1', function() {
      expect(template(-1)).to.equal('plural  plural');
      expect(template(2)).to.equal('plural  plural');
      expect(template(10)).to.equal('plural  plural');
    });

    it('should resolve `plural hi plural` for count not equal to 0 or 1 and by first parameter', function() {
      expect(template(-1, 'hi')).to.equal('plural hi plural');
      expect(template(2, 'hi')).to.equal('plural hi plural');
      expect(template(10, 'hi')).to.equal('plural hi plural');
    });
  });
});
