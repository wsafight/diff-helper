export const enum DataRowStates {
  Added = 'added',
  UnChanged = 'unchanged',
  Modified = 'modified',
  Deleted = 'deleted'
}

export const getChangedItem = (newVal: any, _oldVal: any) => newVal

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

export const hasValForArray = (val: any): val is Array<any> => {
  return Array.isArray(val) && val.length > 0;
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