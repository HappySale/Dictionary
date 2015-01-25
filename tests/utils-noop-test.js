/** related to module: template */
import { expect } from 'chai';
import noop from '../src/utils/noop';


describe('utils/noop', function() {
  it('should be function', function() {
    expect(typeof noop).to.equal('function');
  });

  it('should be return a function', function() {
    let result = noop.create();

    expect(typeof result).to.equal('function');
  });
});
