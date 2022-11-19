import { simpleListDiff } from '../src/list-diff'

describe('simple-list-diff', () => {
  it('error-param', () => {
    expect(simpleListDiff([], [])).toEqual(null);
  });
});