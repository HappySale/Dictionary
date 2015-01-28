/** related to module: utils/noop */
import { expect } from 'chai';
import { default as noop, createNoop } from '../src/utils/noop';


describe('utils/noop', function() {
  it('should be function', function() {
    expect(typeof noop).to.equal('function');
  });

  it('should be return a function', function() {
    let result = createNoop();

    expect(typeof result).to.equal('function');
  });
});
