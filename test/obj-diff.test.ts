import { simpleObjDiff } from '../src/obj-diff'

describe('somple-obj-diff', () => {
  it('error-param', () => {
    expect(simpleObjDiff(1 as any, 2 as any)).toEqual({});
  });

  it('remove-item', () => {
    expect(simpleObjDiff({}, { b: 1 })).toEqual({ b: null });
  });

  it('add-item', () => {
    expect(simpleObjDiff({ b: 1 }, {})).toEqual({ b: 1 });
  });

  it('change-item', () => {
    expect(simpleObjDiff({ b: 1 }, { b: 123 })).toEqual({ b: 1 });
  });

  it('multiple-item', () => {
    expect(simpleObjDiff({
      b: 1, c: 12,
    }, {
      b: 123, a: 123213
    })).toEqual({ b: 1, c: 12, a: null });
  });

  it('add-item', () => {
    expect(simpleObjDiff({ b: new Date('2020-01-02'), c: 23, d: 32423, e: 3234 }, { b: 123 })).toEqual({ b: new Date('2020-01-02'), c: 23, d: 32423, e: 3234 });
  });

  it('empty-param', () => {
    expect(simpleObjDiff({}, { a: 1 }, { empty: '' })).toEqual({ a: '' });
  });

  it('empty-param-undefine', () => {
    expect(simpleObjDiff({}, { a: 1 }, { empty: null })).toEqual({ a: null });
  });

  it('no-diffFun-params', () => {
    expect(simpleObjDiff({ a: [12, 3, 4] }, { a: [1, 2, 3] },)).toEqual({ a: [12, 3, 4] });
  });

  it('diffFun-params', () => {
    expect(simpleObjDiff({ a: [12, 3, 4], b: 11 }, { a: [1, 2, 3], c: 22 }, {
      diffFun: (key, a, b) => {
        switch (key) {
          case 'a':
            return a.filter((item: any) => b.includes(item))
        }
        return null;
      }
    })).toEqual({ a: [3], b: 11, c: null });
  });

  it('diffFun-number', () => {
    expect(simpleObjDiff({ a: 1 }, { a: 2 })).toEqual({a: 1})
  })

  it('diffFun-string', () => {
    expect(simpleObjDiff({ a: '1' }, { a: 2 })).toEqual({a: '1'})
  })

  it('diffFun-obj', () => {
    expect(simpleObjDiff({ a: {a: '1'} }, { a: 2 })).toEqual({a: {a: '1'}})
  })

  it('diffFun-obj', () => {
    expect(simpleObjDiff({ a: {a: '1'} }, { a: 2 })).toEqual({a: {a: '1'}})
  })

  it('diffFun-list', () => {
    expect(simpleObjDiff({ a: {a: [1,2]} }, { a: 2 })).toEqual({a: {a:[1,2]}})
  })

  it('diffFun-empty', () => {
    expect(simpleObjDiff({ a: null, c: '' }, { a: null, c: '' })).toEqual({})
  })

  it('diffFun-obj-copy', () => {
    expect(simpleObjDiff({ a: {a: '1'} }, { a: 2 })).toEqual({a: {a: '1'}})
  })
});