/** related to module: dictionary */
import { expect } from 'chai';
import { isFunction } from '../src/utils/type-of';
import Dictionary from '../src/dictionary';


describe('Dictionary', function() {
  describe('it exists', function() {
    it('should exist', function() {
      expect(Dictionary).to.exist();
    });
  });

  describe('language initialization', function() {
    it('should be default on English', function() {
      let dict = new Dictionary();

      expect(dict.getCurrentLanguage()).to.equal('en');
    });

    it('should set to language that set on constructor', function() {
      let dict = new Dictionary({ language: 'he' });

      expect(dict.getCurrentLanguage()).to.equal('he');
    });

    it('should set to language by `setCurrentLanguage`', function() {
      let dict = new Dictionary();

      expect(dict.getCurrentLanguage()).to.equal('en');

      dict.setCurrentLanguage('he');

      expect(dict.getCurrentLanguage()).to.equal('he');
    });
  });

  describe('addTexts()', function() {
    const PRE_TEMPLATES = {
      '__hi__': 'hello!',
      '__stars__': {
        none: 'You have no stars',
        single: 'You have a star',
        other: 'You have {{count}} stars'
      }
    };
    let dict;

    beforeEach(function() {
      dict = new Dictionary();
    });

    it('add preTemplates of texts with no prefix', function() {
      dict.addTexts(PRE_TEMPLATES);
    });

    it('add preTemplates of texts with prefix', function() {
      dict.addTexts(PRE_TEMPLATES, 'hello');
    });
  });

  describe('call template functions', function() {
    describe('no prefix', function() {
      const PRE_TEMPLATES = {
        '__hi__': 'hello!',
        '__hi_person__': 'hi {{0}}!',
        '__stars__': {
          none: 'You have no stars',
          single: 'You have a star',
          other: 'You have {{count}} stars'
        }
      };
      let dict;

      beforeEach(function() {
        dict = new Dictionary();
        dict.addTexts(PRE_TEMPLATES);
      });

      it('should return hello! for __hi__ when calling t()', function() {
        let result = dict.t('__hi__');

        expect(result).to.equal('hello!');
      });

      it('should return "You have no stars" for __stars__ when calling c(..., 0)', function() {
        let result = dict.c('__stars__', '', 0);

        expect(result).to.equal('You have no stars');
      });

      it('should return "You have a star" for __stars__ when calling c(..., 1)', function() {
        let result = dict.c('__stars__', '', 1);

        expect(result).to.equal('You have a star');
      });

      it('should return "You have 5 stars" for __stars__ when calling c(..., 5)', function() {
        let result = dict.c('__stars__', '', 5);

        expect(result).to.equal('You have 5 stars');
      });

      it('should return "hi guy!" for __hi_person__ when calling gt()', function() {
        let result = dict.gt('__hi_person__', 'guy');

        expect(result).to.equal('hi guy!');
      });

      it('should return "You have no stars" for __stars__ when calling gc(..., 0)', function() {
        let result = dict.gc('__stars__', 0);

        expect(result).to.equal('You have no stars');
      });
    });

    describe('with prefix', function() {
      const prefix = 'prefixed';
      let dict = new Dictionary(),
        preTemplates = {
          '__hi__': 'hello!',
          '__stars__': {
            none: 'You have no stars',
            single: 'You have a star',
            other: 'You have {{count}} stars'
          }
        };

      dict.addTexts(preTemplates, prefix);

      it('should return hello! for __hi__ when calling t()', function() {
        let result = dict.t('__hi__', prefix);

        expect(result).to.equal('hello!');
      });

      it('should return "You have no stars" for __stars__ when calling c(..., 0)', function() {
        let result = dict.c('__stars__', prefix, 0);

        expect(result).to.equal('You have no stars');
      });

      it('should return "You have a star" for __stars__ when calling c(..., 1)', function() {
        let result = dict.c('__stars__', prefix, 1);

        expect(result).to.equal('You have a star');
      });

      it('should return "You have 5 stars" for __stars__ when calling c(..., 5)', function() {
        let result = dict.c('__stars__', prefix, 5);

        expect(result).to.equal('You have 5 stars');
      });
    });
  });

  describe('getShortcuts()', function() {
    it('should return template functions', function() {
      let dict = new Dictionary(),
      { t, c, gt, gc, lang } = dict.getShortcuts();

      expect(isFunction(t)).to.true();
      expect(isFunction(c)).to.true();
      expect(isFunction(gt)).to.true();
      expect(isFunction(gc)).to.true();
      expect(isFunction(lang)).to.true();
    });
  });

  describe('addLanguage()', function() {
    const EN = { '_hi_': 'hi {{0}}!' };
    const HE = { '_hi_': 'שלום {{0}}!' };
    let dict;

    beforeEach(function() {
      dict = new Dictionary();

      dict.addTexts(EN);
      dict.setCurrentLanguage('he');
      dict.addTexts(HE);
    });

    it('should return localized English to __hi__', function() {
      dict.setCurrentLanguage('en');

      let result = dict.gt('_hi_', 'bob');

      expect(result).to.equal('hi bob!');
    });

    it('should return localized Hebrew to __hi__', function() {
      dict.setCurrentLanguage('he');

      let result = dict.gt('_hi_', 'משה');

      expect(result).to.equal('שלום משה!');
    });
  });

  describe('getLanguagesList()', function() {
    it('should return an array', function() {
      let dict = new Dictionary(),
      result = dict.getLanguagesList();

      expect(isArray(result)).to.true();
    });

    it('should return only en by default', function() {
      let dict = new Dictionary(),
      result = dict.getLanguagesList();

      expect(result).to.eql(['en']);
    });

    it('should return only it by constructor', function() {
      let dict = new Dictionary({ language: 'it' }),
      result = dict.getLanguagesList();

      expect(result).to.eql(['it']);
    });

    it('should return en and he by adding language', function() {
      let dict, result;

      dict = new Dictionary(),
      dict.addLanguage('he');
      result = dict.getLanguagesList();

      expect(result).to.contain('en', 'he');
      expect(result.length).to.equal(2);
    });
  });
});
