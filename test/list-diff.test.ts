import { simpleListDiff } from '../src/list-diff'
import { simpleObjDiff } from '../src/obj-diff'

describe('simple-list-diff', () => {

  it('error-param', () => {
    try {
      simpleListDiff({
        newVal: 1 as any,
        oldVal: 2 as any,
        options: {
          key: 'id',
          getChangedItem: () => { }
        }
      })
    } catch (e) {
      expect(e).toEqual(new Error("params newVal must be a Array"))
    }
  })

  it('equal-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bb' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [],
      deletedLines: [],
      modifiedLines: [],
    })
  })

  it('remove-item', () => {
    expect(simpleListDiff({
      newVal: [],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [],
      deletedLines: [{
        id: 1
      }],
      modifiedLines: [],
    })
  })

  it('add-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bbc' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [{
        id: 2, cc: 'bbc'
      }],
      deletedLines: [],
      modifiedLines: [],
    })
  })

  it('add-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 2, cc: 'bbc' }, { id: 1, cc: 'bb' },],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [{
        id: 2, cc: 'bbc'
      }],
      deletedLines: [],
      modifiedLines: [],
    })
  })

  it('modifie-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [],
      deletedLines: [],
      modifiedLines: [{
        id: 1, cc: 'bbc'
      }],
    })
  })

  it('change-all-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }, { bb: '123' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [{
        bb: '123'
      }],
      deletedLines: [{
        id: 2
      }],
      modifiedLines: [{
        id: 1,
        cc: 'bbc'
      }],
    })
  })

  it('change-all-item-all-count', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }, { bb: '123' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [{
        bb: '123', 
      }],
      deletedLines: [{  
        id: 2,
      }],
      modifiedLines: [{
        cc: 'bbc',
        id: 1,
      }],
    })
  })



  it('equal-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bb' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        sortName: 'index'
      }
    })).toEqual({
      addedLines: [],
      deletedLines: [],
      modifiedLines: [],
      noChangeLines: [],
    })
  })

  it('remove-item', () => {
    expect(simpleListDiff({
      newVal: [],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      deletedLines: [{
        id: 1,
      }],
      addedLines: [],
      modifiedLines: [],
    })
  })

  it('add-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bbc' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        sortName: '11'
      }
    })).toEqual({
      addedLines: [{
        id: 2,
        cc: 'bbc',
        11: 2
      }],
      deletedLines: [],
      modifiedLines: [],
      noChangeLines: [],
    })
  })

  it('change-all-item', () => {
    expect(simpleListDiff({
      newVal: [{ bb: '123' }, { id: 1, cc: 'bbc' },],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [{
        bb: '123',
      }],
      modifiedLines: [
        {
          cc: "bbc",
          id: 1,
        }
      ],
      deletedLines: [
        {
          id: 2,
        }
      ]
    })
  })

  it('change-all-item-all-count', () => {
    expect(simpleListDiff({
      newVal: [{ bb: '123' }, { id: 1, cc: 'bbc' },],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 3, cc: 234 }, { id: 2, cc: 'bdf' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        sortName: 'index',
      }
    })).toEqual({
      noChangeLines: [],
      addedLines: [
        {
          bb: '123',
          index: 1
        }
      ],
      deletedLines: [
        {
          id: 3,
        }, {
          id: 2,
        }
      ],
      modifiedLines: [
        {
          cc: "bbc",
          id: 1,
          index: 2
        }
      ]
    })
  })


  it('change-all-item-all-count-sort', () => {
    expect(simpleListDiff({
      newVal: [{ id: 2, cc: 'bdf' }, { id: 3, bb: '333' }, { id: 1, cc: 'bb' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 3, bb: '333' }, { id: 2, cc: 'bdf' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        sortName: 'index'
      }
    })).toEqual({
      addedLines: [],
      deletedLines: [],
      modifiedLines: [],
      noChangeLines: [{
        id: 2,
        index: 1
      }, {
        id: 1,
        index: 3
      }],
    })
  })


  it('change-all-item-all-count-sort', () => {
    expect(simpleListDiff({
      newVal: [{ id: 2, cc: 'bdf' }, { id: 3, bb: '333' }, { id: 1, cc: 'bb' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 3, bb: '333' }, { id: 2, cc: 'bdf' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        sortName: 'index',
      }
    })).toEqual({
      addedLines: [],
      deletedLines: [],
      modifiedLines: [],
      noChangeLines: [
        {
          id: 2,
          index: 1
        }, {
          id: 1,
          index: 3
        }
      ]
    })
  })


  it('add-item-sort', () => {
    expect(simpleListDiff({
      newVal: [{ id: 2, cc: 'bbc' }, { id: 1, cc: 'bb' },],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        sortName: '222'
      }
    })).toEqual({
      addedLines: [
        {
          id: 2,
          cc: 'bbc',
          222: 1
        }
      ],
      noChangeLines: [
        {
          id: 1,
          222: 2
        }
      ],
      deletedLines: [],
      modifiedLines: [],
    })
  })

})