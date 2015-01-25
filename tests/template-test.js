/** related to module: template */
import { expect } from 'chai';
import assign from 'object-assign';
import template from '../src/template';


describe('template', function() {
  describe('miss arguments', function() {
    it('should throw for missing params', function() {
      expect(template).to.throw();
    });

    it('should throw for textsParams contains non strings', function() {
      expect(() => template([1])).to.throw();
    });

    it('should throw for params are not an object or array', function() {
      expect(() => template([], 1)).to.throw();
      expect(() => template([], function() {})).to.throw();
      expect(() => template([], new Date())).to.throw();
    });
  });

  describe('with a empty params', function() {
    it('should equals to `hello world` from [`hello world`]', function() {
      let result = template(['hello world']);
      expect(result).to.equal('hello world');
    });

    it('should equals to `hello world` from [`hello`, `0`, ` world`]', function() {
      let result = template(['hello', '0', ' world']);
      expect(result).to.equal('hello world');
    });
  });

  describe('with params', function() {
    it('should equals to `hello bob` from [`hello `, `0`], [`bob`]', function() {
      let result = template(['hello ', '0'], ['bob']);

      expect(result).to.equal('hello bob');
    });

    it('should equals to `hello bob & bobby!` from [`hello `, `0`, ` & `, `1`, `!`], [`bob`, `bobby`]', function() {
      let result = template(['hello ', '0', ' & ', '1', '!'], ['bob', 'bobby']);

      expect(result).to.equal('hello bob & bobby!');
    });

    it('should equals to `hello bob` from [`hello `, `someone`], [`bob`]', function() {
      let result = template(['hello ', 'someone'], { someone: 'bob' });

      expect(result).to.equal('hello bob');
    });

    it('should equals to `hello bobby & bob!` from [`hello `, `0`, ` & `, `name`, `!`], { 0: `bobby`, name: `bob` }', function () {
      let params = assign(['bobby'], { 'name': 'bob' });
      let result = template(['hello ', '0', ' & ', 'name', '!'], params);

      expect(result).to.equal('hello bobby & bob!');
    });
  });
});
