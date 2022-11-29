import { simpleObjDiff } from "./obj-diff"
import { basicDiffParams, hasValForArray, invariant } from "./utils"

export type ListKey = string | number
export interface SimpleListDiffOptions {
  key: string
  getChangedItem?: (params: {
    newLine: any,
    oldLine: any,
  }) => any
  sortName?: string;
}

const DEFAULT_OPTIONS: SimpleListDiffOptions = {
  key: 'id',
}

const checkOptions = (opts: SimpleListDiffOptions) => {
  const { key, getChangedItem } = opts
  invariant(typeof key !== 'string' || key.length === 0, 'options "key" must be a no empty string')
  invariant(!!getChangedItem && typeof getChangedItem !== 'function', 'options "getChangedItem" must be a function')
}

interface SimpleObjDiffParams extends basicDiffParams<any[]> {
  options: SimpleListDiffOptions
}

export const simpleListDiff = ({
  newVal, oldVal, options
}: SimpleObjDiffParams) => {
  invariant(!Array.isArray(newVal), 'params newVal must be a Array')
  invariant(!Array.isArray(oldVal), 'params oldVal must be a Array')

  const opts = { ...DEFAULT_OPTIONS, ...options }

  checkOptions(opts)

  const { key, sortName = '' } = opts

  const hasSortName: boolean = typeof sortName === 'string' && sortName.length > 0

  let { getChangedItem } = opts;

  if (!getChangedItem) {
    getChangedItem = ({
      newLine,
      oldLine,
    }) => {
      const result = simpleObjDiff({
        newVal: newLine,
        oldVal: oldLine,
      });
      if (!Object.keys(result).length) {
        return null;
      }
      return { [key]: newLine[key], ...result };
    }
  }

  if (!hasValForArray(oldVal)) {
    return {
      ...hasSortName && { sortChanged: true },
      addedLines: newVal.map(item => ({
        ...item,
      })),
      deletedLines: [],
      modifiedLines: [],
      ...hasSortName && { noChangeLines: [] },
    }
  }

  // 设定增删改数
  const addedLines: any[] = [];
  const deletedLines: any[] = [];
  const modifiedLines: any[] = [];
  const noChangeLines: any[] = [];

  const checkedKeys: Set<ListKey> = new Set<ListKey>();

  newVal.forEach((newLine, index: number) => {

    let oldLineIndex: any = oldVal.findIndex(x => x[key] === newLine[key])

    if (oldLineIndex === -1) {
      addedLines.push({
        ...newLine,
        ...hasSortName && { [sortName]: index + 1 }
      })
    } else {
      const oldLine = oldVal[oldLineIndex]

      const addSortParams = hasSortName && index !== oldLineIndex

      checkedKeys.add(oldLine[key])

      const result = getChangedItem!({
        newLine,
        oldLine
      })
      if (result !== null && result !== undefined) {    
        modifiedLines.push({
          ...result, 
          ...addSortParams && {[sortName]: index + 1}
        })
      } else {
        if (addSortParams) {
          noChangeLines.push({ 
            [key!]: newLine[key!], 
            [sortName]: index + 1,
          })
        }
      }
    }
  })

  oldVal.forEach(oldLine => {
    if (checkedKeys.has(oldLine[key])) {
      return
    }
    deletedLines.push({ [key]: oldLine[key] })
  })

  return {
    addedLines,
    deletedLines,
    modifiedLines,
    ...hasSortName && { noChangeLines },
  }
}
