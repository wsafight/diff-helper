import { getOwnKeysForObj, isRealObject } from "./utils"

interface simpleDiffObjOptions {
  empty?: null | ''
  diffFun?: (key: string, newVal: any, oldVal: any) => any
  needCopy?: boolean
}

export const simpleObjDiff = (
  newVal: Record<string, any>,
  oldVal: Record<string, any>,
  {
    empty = null,
    diffFun,
    needCopy = false
  }: simpleDiffObjOptions = { empty: null, needCopy: false }
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