/** related to module: dictionary */
import assign from 'object-assign';
import { expect } from 'chai';
import { isFunction, isObject, isArray, isEmpty } from '../src/utils/type-of';
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

      it(`should return empty string for '' when calling t()`, function() {
        const result = dict.t('');

        expect(result).to.equal('');
      });

      it(`should return empty string for undefined when calling t()`, function() {
        const result = dict.t(undefined);

        expect(result).to.equal('');
      });

      it(`should return empty string for '' when calling c()`, function() {
        const result = dict.c('');

        expect(result).to.equal('');
      });

      it(`should return empty string for undefined when calling c()`, function() {
        const result = dict.c(undefined);

        expect(result).to.equal('');
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

  describe('getShortcuts()#lang()', function() {
    const dict = new Dictionary();
    const { lang } = dict.getShortcuts();

    it('should set language to he', function() {
      lang('he');
      expect(dict.getCurrentLanguage()).to.equal('he');
    });

    it('should return language he', function() {
      expect(lang()).to.equal('he');
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

      dict = new Dictionary();
      dict.addLanguage('he');
      result = dict.getLanguagesList();

      expect(result).to.contain('en', 'he');
      expect(result.length).to.equal(2);
    });
  });

  describe('getRecords()', function() {
    const EN = { '_hi_': 'hi {{0}}!' };
    const HE = { '_hi_': 'שלום {{0}}!' };
    const PREFIX = 'prefix';
    let dict, records;

    before(function() {
      dict = new Dictionary({
        recordTexts: true,
        language: 'en'
      });

      dict.addTexts(EN);
      dict.addTexts(EN, PREFIX);

      dict.setCurrentLanguage('he');
      dict.addTexts(HE);
      dict.addTexts(HE, PREFIX);

      records = dict.getRecords();
    });

    it('should return an object', function() {
      expect(isObject(records)).to.true();
    });

    it('should return a non empty object', function() {
      expect(isEmpty(records)).to.false();
    });

    it('should return an object that contains he and en languages keys', function() {
      expect(records).to.keys(['he', 'en']);
    });

    it('should return object that identical to tree', function() {
      const TREE = {
        en: { texts: EN, components: { [PREFIX]: EN } },
        he: { texts: HE, components: { [PREFIX]: HE } }
      };

      expect(records).to.eql(TREE);
    });
  });

  describe('initialization from records', function() {
    const RECORD_EN = {"en":{"texts":{"email notifications":"Email notifications","save":"Save","saved":"Saved…","set language":"Set language","settings":"Settings","when my happysale is live":"when my HappySale is live","when someone comments on my happysale":"when someone comments on my HappySale","when someone message you on happysale":"when someone message you on HappySale","when you receive offer on happysale":"when you receive offer on HappySale"},"components":{"header":{"about us":"About us","blog":"Blog","HappySale":"HappySale","learn more":"Learn more","log in":"Log in","log out":"Log out","menu":"Menu","messages":"Messages","profile":"Profile","profile.image":"{{0}}'s profile image","search":"Search","search.cancel":"Cancel search","search.label":"Search:","search.placeholder":"Search …","search.submit":"Search","sell":"Sell","settings":"Settings","shop":"Shop","support":"Support","terms and privacy":"Terms & privacy"},"categories":{"appliances":"Appliances","automotive and transportation":"Automotive & Transportation","babies":"Babies","collectibles":"Collectibles","electronics":"Electronics","entertainment":"Entertainment","fashion and accesories":"Fashion & Accesories","furniture and decoration":"Furniture & Decoration","giving away":"Giving Away","jewelry":"Jewelry","musical instruments":"Musical Instruments","other":"Other","pets supplies":"Pets Supplies","sports and camping":"Sports & Camping"},"footer":{"about us":"About us","blog":"Blog","jobs":"Jobs","support":"Support","terms of use":"Terms and privacy"}}}};
    const RECORD_HE = {"he":{"texts":{"email notifications":"התראות דוא\"ל","save":"לשמור","saved":"נשמר…","set language":"הגדרות שפה","settings":"הגדרות","when my happysale is live":"כשהמכירה שלי נוצרה","when someone comments on my happysale":"כשמגיבים לי במכירות שלי","when someone message you on happysale":"כששולחים לי הודעות ב־HappySale","when you receive offer on happysale":"כשמצעים לי הצעות ב־HappySale"},"components":{"header":{"about us":"אודות","blog":"בלוג","HappySale":"HappySale","learn more":"לימדו עוד","log in":"התחברו","log out":"התנתקו","menu":"תפריט","messages":"הודעות","profile":"פרופיל","profile.image":"תמונה של {{0}}","search":"חיפוש","search.cancel":"בטלו חיפוש","search.label":"חשפו:","search.placeholder":"חיפוש …","search.submit":"חפשו","sell":"מכרו","settings":"הגדרות","shop":"קנו","support":"תמיכה","terms and privacy":"תנאים ופרטיות"},"categories":{"appliances":"מכשירי חשמל","automotive and transportation":"רכב","babies":"לתינוק","collectibles":"אספנות","electronics":"אלקטרוניקה","entertainment":"בידור ותוכן","fashion and accesories":"אופנה","furniture and decoration":"ריהוט ועיצוב","giving away":"למסירה","jewelry":"תכשיטים","musical instruments":"כלי נגינה","other":"אחר","pets supplies":"ציוד לחיות","sports and camping":"ספורט ומחנאות"},"footer":{"about us":"אודות","blog":"בלוג","jobs":"ג'ובס","support":"תמיכה","terms of use":"תנאי השימוש"}}}};

    it('should throw', function() {
      expect(() => new Dictionary({ records: function() {} })).to.throw();
      expect(() => new Dictionary({ records: new Date() })).to.throw();
    });

    it('should not throw', function() {
      expect(() => new Dictionary({ records: RECORD_EN })).to.not.throw();
    });

    it('should be contains records as initialization', function() {
      let dict = new Dictionary({ records: RECORD_HE, recordTexts: true });
      let records = dict.getRecords();

      expect(records).to.eql(RECORD_HE);
    });

    it('should be contains records as initialization of dual lingo', function() {
      const RECORDS = assign({}, RECORD_EN, RECORD_HE);
      let dict = new Dictionary({ records: RECORDS, recordTexts: true });
      let records = dict.getRecords();

      expect(records).to.eql(RECORDS);
    });
  });
});
