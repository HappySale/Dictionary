/** related to module: language */
import { expect } from 'chai';
/** Chai doesn't have `except.to.be.function` */
import { isFunction, isObject, isEmpty } from '../src/utils/type-of';
import Language from '../src/language';


describe('Language', function() {
  describe('it exists', function() {
    it('should exist', function() {
      expect(Language).to.exist();
    });
  });

  describe('constructor', function() {
    let language = new Language();

    it('should have `texts`', function() {
      expect(language.texts).to.exist();
    });

    it('should have `components`', function() {
      expect(language.components).to.exist();
    });
  });

  describe('add()', function() {
    let language;

    beforeEach(function() {
      language = new Language();
    });

    it('should work with text pre template', function() {
      expect(function() {
        language.add({ _key_text_: 'text' });
      }).to.not.throw();
    });

    it('should work with count pre template', function() {
      expect(function() {
        language.add({ _key_count_: { other: 'hello' } });
      }).to.not.throw();
    });

    it('should work with same texts on prefix and unprefix simultaneous', function() {
      const TEXTS = {
        _key_text_: 'text',
        _key_count_: { other: 'hello' }
      };

      expect(function() {
        language.add(TEXTS);
        language.add(TEXTS, 'prefix');
        language.add(TEXTS, 'prefix2');
      }).to.not.throw();
    });

    describe('fail tests', function() {
      it('should fail for undefined', function() {
        expect(language.add).to.throw();
      });

      it('should fail for number', function() {
        expect(() => language.add(1)).to.throw();
      });

      it('should fail when value of object is not a string or an object', function() {
        expect(() => language.add({ _key_fail_1_: 1 })).to.throw();
        expect(() => language.add({ _key_fail_2_: { other: 1 } })).to.throw();
      });
    });
  });

  describe('get()', function() {
    describe('texts template', function() {
      let language = new Language();
      language.add({ _key_text_: 'text' });

      it('should return a function for key that set to a text template', function() {
        let template = language.get('_key_text_');

        expect(template).to.exist();
        expect(isFunction(template)).to.true();
      });

      it('should return a function that render `text`', function() {
        let template = language.get('_key_text_');
        let result = template();

        expect(result).to.equal('text');
      });
    });

    describe('count template', function() {
      let language = new Language();
      language.add({ _key_count_: { other: 'hello' } });

      it('should return a function for key that set to a count template', function() {
        let template = language.get('_key_count_');

        expect(template).to.exist();
        expect(isFunction(template)).to.true();
      });

      it('should return a function that render `hello`', function() {
        let template = language.get('_key_count_');
        let result = template(0);

        expect(result).to.equal('hello');
      });
    });
  });

  describe('getRecords()', function() {
    describe('feature on', function() {
      const TEXTS = {
        'hi': 'hello',
        'bugs': {
          'none': 'no bugs',
          'other': 'there are {{count}} bugs'
        }
      };
      const COMPONENT_PREFIX = 'component';
      let lang;

      beforeEach(function() {
        lang = new Language({ recordTexts: true });
        /** Texts - templates */
        lang.add(TEXTS);

        /** Components - templates */
        lang.add(TEXTS, COMPONENT_PREFIX);
      });

      it('should return an object', function() {
        let result = lang.getRecords();

        expect(isObject(result)).to.true();
        expect(isEmpty(result)).to.false();
      });

      it('records.texts should match TEXTS', function() {
        let result = lang.getRecords(),
        { texts } = result;

        expect(texts).to.exist();
        expect(texts).to.eql(TEXTS);
      });

      it('records.components should match TEXTS', function() {
        let result = lang.getRecords(),
        { components } = result;

        expect(components).to.exist();
        expect(COMPONENT_PREFIX in components).to.true();
        expect(components[COMPONENT_PREFIX]).to.eql(TEXTS);
      });
    });

    describe('feature off', function() {
      it('should return null if it `recordTexts` is false', function() {
        let lang = new Language({ recordTexts: false });
        let result = lang.getRecords();

        expect(result).to.equal(null);
      });

      it('should return null if it `recordTexts` was not set', function() {
        let lang = new Language();
        let result = lang.getRecords();

        expect(result).to.equal(null);
      });
    });
  });
});
