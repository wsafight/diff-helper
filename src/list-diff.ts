import { simpleObjDiff } from "./obj-diff"
import { basicDiffParams, DataRowStates, hasValForArray, invariant } from "./utils"

export type ListKey = string | number
export interface BaseSimpleListDiffOptions {
  key: string
  getChangedItem?: (params: {
    newLine: any,
    oldLine: any,
  }) => any
  fields?: string[]
  sortName?: string;
}

export interface SimpleListDiffOptions extends BaseSimpleListDiffOptions {
  isSplit?: boolean
}

const DEFAULT_OPTIONS: SimpleListDiffOptions = {
  key: 'id',
  fields: [],
  isSplit: true
}

const checkOptions = (opts: BaseSimpleListDiffOptions) => {
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

  const { key, fields, isSplit, sortName = '' } = opts

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
      ...fields?.includes('modifiedCount') && { modifiedCount: 0 },
      ...fields?.includes('addedCount') && { addedCount: newVal.length },
      ...fields?.includes('deletedCount') && { deletedCount: 0 },
      ...hasSortName && { sortChanged: true },
      [isSplit ? 'line' : 'addedLines']: newVal.map(item => ({
        ...item,
        rowState: DataRowStates.Added,
      })),
    }
  }

  const retLines: any[] = []

  let sortChanged: boolean = false

  let addedCount: number = 0
  let modifiedCount: number = 0
  let deletedCount: number = 0

  const checkedKeys: Set<ListKey> = new Set<ListKey>();

  newVal.forEach((newLine, index: number) => {

    let oldLineIndex: any = oldVal.findIndex(x => x[key] === newLine[key])

    if (oldLineIndex === -1) {
      retLines.push({
        ...newLine,
        rowState: DataRowStates.Added,
        ...hasSortName && { [sortName]: index + 1 }
      })
      sortChanged = true
      addedCount++
    } else {
      const oldLine = oldVal[oldLineIndex]

      const isIndexChanged = index !== oldLineIndex

      if (isIndexChanged) {
        sortChanged = true
      }
      
      const addSortParams = hasSortName && index !== oldLineIndex

      checkedKeys.add(oldLine[key])

      const result = getChangedItem!({
        newLine,
        oldLine
      })
      if (result !== null && result !== undefined) {    
        retLines.push({
          ...result, 
          rowState: DataRowStates.Modified,
          ...addSortParams && {[sortName]: index + 1}
        })
        modifiedCount++
      } else {
        if (addSortParams) {
          retLines.push({ 
            [key!]: newLine[key!], 
            rowState: DataRowStates.NoChange,
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
    retLines.push({ [key]: oldLine[key], rowState: DataRowStates.Deleted })
    deletedCount++
  })

  const dataToSet: Record<string, any> = {}

  if (isSplit) {
    const addedLines: any[] = []
    const deletedLines: any[] = []
    const modifiedLines: any[] = []
    const noChangeLines: any[] = []
    retLines.forEach(item => {
      const { rowState, ...rowLine } = item
      switch (rowState) {
        case DataRowStates.Added:
          addedLines.push(rowLine)
          break;
        case DataRowStates.Deleted:
          deletedLines.push(rowLine)
          break;
        case DataRowStates.Modified:
          modifiedLines.push(rowLine)
          break;
        case DataRowStates.NoChange:
          noChangeLines.push(rowLine)
          break;
      }
    })
    dataToSet.addedLines = addedLines
    dataToSet.deletedLines = deletedLines
    dataToSet.modifiedLines = modifiedLines
    if (hasSortName) {
      dataToSet.noChangeLines = noChangeLines
    }
  } else {
    dataToSet.lines = retLines
  }

  return {
    ...fields?.includes('modifiedCount') && { modifiedCount },
    ...fields?.includes('addedCount') && { addedCount },
    ...fields?.includes('deletedCount') && { deletedCount },
    ...hasSortName && { sortChanged },
    ...dataToSet
  }
}
