import { EmptyVal, getOwnKeysForObj, isRealObject } from "./utils"

interface simpleDiffObjOptions {
  empty?: EmptyVal
  diffFun?: (key: string, newVal: any, oldVal: any) => boolean
}

export const simpleObjDiff = (
  newVal: Record<string, any>,
  oldVal: Record<string, any>,
  {
    empty = null,
    diffFun
  }: simpleDiffObjOptions = {
      empty: null
    }
): Record<string, any> => {
  if (!isRealObject(oldVal) || !isRealObject(newVal)) {
    return {}
  }

  const diffResult: Record<string, any> = {}

  const checkedKeys: Set<string> = new Set()

  const hasDiffFun = typeof diffFun === 'function'

  const keys = getOwnKeysForObj(newVal)
  keys.forEach(key => {
    checkedKeys.add(key)
    let isChanged = false

    if (hasDiffFun) {
      const diffResultByKey = diffFun(key, newVal[key], oldVal[key])
      if (diffResultByKey) {
        diffResult[key] = diffResultByKey
        isChanged = true
      }
    }

    if (isChanged) {
      return
    }

    if (JSON.stringify(newVal[key]) !== JSON.stringify(oldVal[key])) {
      diffResult[key] = newVal
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