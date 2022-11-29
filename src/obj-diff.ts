import { basicDiffParams, getOwnKeysForObj, invariant, isRealObject } from "./utils"

interface simpleDiffObjOptions {
  empty?: null | ''
  diffFun?: (params: {
    key: string
    newPropVal: any
    oldPropVal: any
  }) => any
  needCopy?: boolean
}

interface SimpleObjDiffParams extends basicDiffParams<Record<string, any>>  {
  options?: simpleDiffObjOptions
}

const DEFAULT_OPTIONS: simpleDiffObjOptions = {
  empty: null,
  needCopy: false,
}


export const simpleObjDiff = ({
  newVal,
  oldVal,
  options,
}: SimpleObjDiffParams
): Record<string, any> => {
  invariant(!isRealObject(newVal), 'params newVal must be a Object')
  invariant(!isRealObject(oldVal), 'params oldVal must be a Object')

  const diffResult: Record<string, any> = {}

  const checkedKeys: Set<string> = new Set()

  const { diffFun, empty, needCopy } = { ...DEFAULT_OPTIONS, ...options };

  const hasDiffFun = typeof diffFun === 'function'

  const keys = getOwnKeysForObj(newVal)
  keys.forEach(key => {
    checkedKeys.add(key)
    let isChanged = false

    if (hasDiffFun) {
      const diffResultByKey = diffFun({
        key,
        newPropVal: newVal[key],
        oldPropVal: oldVal[key]
      })
      if (diffResultByKey !== null && diffResultByKey !== undefined) {
        diffResult[key] = diffResultByKey
        isChanged = true
      }
    }

    if (isChanged) {
      return
    }

    if (typeof newVal[key] !== typeof oldVal[key] || JSON.stringify(newVal[key]) !== JSON.stringify(oldVal[key])) {
      diffResult[key] = needCopy ? JSON.parse(JSON.stringify(newVal)) : newVal[key]
    }
  })

  const initialKeys = getOwnKeysForObj(oldVal)
  initialKeys.forEach(key => {
    if (checkedKeys.has(key)) {
      return
    }
    diffResult[key] = empty
  })
  return diffResult
}

export const isSimpleObjChange = ({
  newVal,
  oldVal,
  options,
}: SimpleObjDiffParams
): boolean => {
  if (!isRealObject(oldVal) || !isRealObject(newVal)) {
    return true
  }

  const checkedKeys: Set<string> = new Set()

  const { diffFun } = { ...DEFAULT_OPTIONS, ...options };

  const hasDiffFun = typeof diffFun === 'function'

  const keys = getOwnKeysForObj(newVal)

  const initialKeys = getOwnKeysForObj(oldVal)

  if (keys.length !== initialKeys.length) {
    return true
  }

  for (let key of keys) {
    checkedKeys.add(key)
    if (hasDiffFun) {
      const diffResultByKey = diffFun({
        key,
        newPropVal: newVal[key],
        oldPropVal: oldVal[key]
      })
      if (diffResultByKey !== null && diffResultByKey !== undefined) {
        return true
      }
    }

    if (typeof newVal[key] !== typeof oldVal[key] || JSON.stringify(newVal[key]) !== JSON.stringify(oldVal[key])) {
      return true
    }
  }

  for (let key of initialKeys) {
    if (checkedKeys.has(key)) {
      continue
    }
    return true
  }

  return false
}