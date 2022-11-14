import { EmptyVal, isDate, isEmpty, isObject } from "./utils"

const diff = (newVal: any, oldVal: any,  empty: EmptyVal = null): any => {
  if (oldVal === undefined || oldVal === '') {
    oldVal = null
  }
  if (newVal === undefined || newVal === '') {
    newVal = null
  }

  if (oldVal === newVal) {
    return null
  }

  if (!isObject(oldVal) || !isObject(newVal)) {
    return newVal
  }

  if (isDate(oldVal) || isDate(newVal)) {
    if (oldVal.valueOf() === newVal.valueOf()) {
      return null
    }
    return newVal
  }

  const diffResult: Record<string, any> = {}

  const checkedKeys: Set<string> = new Set<string>();

  Object.keys(newVal).forEach(key => {
    if (isEmpty(newVal[key])) {
      return
    }

    checkedKeys.add(key)

    if (isEmpty(oldVal[key])) {
      diffResult[key] = newVal[key]
    } else {
      const difference = diff((oldVal as any)[key], (newVal as any)[key], empty)
      if (difference !== null) {
        diffResult[key] = difference
      }
    }
  })
  Object.keys(oldVal).forEach(key => {
    if (checkedKeys.has(key)) {
      return
    }
    if (!isEmpty(oldVal[key]) && isEmpty(newVal[key])) {
      diffResult[key] = empty
    }
  })
  return Object.keys(diffResult).length ? diffResult : null
}

export const commonDiff = <T>(newVal: T, oldVal: T, empty?: EmptyVal) => diff(oldVal, newVal, empty)
