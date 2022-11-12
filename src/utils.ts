/**
 * 检测错误并抛出
 * @param condition 是否抛出错误
 * @param errorMsg
 */
export const invariant = (condition: boolean, errorMsg: string) => {
  if (condition) {
    throw new Error(errorMsg);
  }
}

export type EmptyVal = null | undefined | ''

export const isEmpty = (val: any): val is EmptyVal => {
  return val === null || val === undefined || val === ''
}

export const isDate = (val: any): val is Date => {
  return val instanceof Date
}

export const isObject = (val: any): val is Object => {
  return val !== null && typeof val === 'object'
}

export const isRealObject = (val: any): val is Record<string, any> => {
  return isObject(val) && !Array.isArray(val)
}

export const getOwnKeysForObj = (val: Record<string, any>): string[] => {
  if (!val) {
    return []
  }

  if (!isRealObject(val)) {
    return []
  }

  return Object.keys(val).filter(key => val.hasOwnProperty(key))
}