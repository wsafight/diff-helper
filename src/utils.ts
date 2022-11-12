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

export const isEmpty = (val: any) => {
  return val === null || val === undefined || val === ''
}

export const isObject = (val: any) => {
  return val !== null && typeof val === 'object'
}

export const isDate = (val: any) => {
  return val instanceof Date
}

export const getOwnKeysForObj = (val: Record<string, any>): string[] => {
  if (!val) {
    return []
  }

  if (!isObject(val)) {
    return []
  }

  if (Array.isArray(val)) {
    return []
  }

  return Object.keys(val).filter(key => val.hasOwnProperty(key))
}