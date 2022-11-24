export const OBJECT_TYPE: string = '[object Object]'
export const ARRAY_TYPE: string = '[object Array]'
export const FUNCTION_TYPE: string = '[object Function]'

export const enum DataRowStates {
  Added = 'added',
  Deleted = 'deleted',
  Modified = 'modified',
  NoChange = 'noChange',
}

export interface basicDiffParams<T> {
  newVal: T
  oldVal: T
}

export const invariant = (condition: boolean, errorMsg: string) => {
  if (condition) {
    throw new Error(errorMsg);
  }
}

export type EmptyVal = null | undefined | ''

export const isEmpty = (val: any): val is EmptyVal => {
  return val === null || val === undefined || val === ''
}

export const isDate = (val: any): val is Date => val instanceof Date

export const getType = (val: any) => Object.prototype.toString.call(val)

export const isObject = (val: any): val is Object => val !== null && typeof val === 'object'

export const isRealObject = (val: any): val is Record<string, any> => getType(val) === OBJECT_TYPE

export const hasValForArray = (val: any): val is Array<any> => Array.isArray(val) && val.length > 0

export const getOwnKeysForObj = (val: Record<string, any>): string[] => {
  if (!val) {
    return []
  }

  if (!isRealObject(val)) {
    return []
  }

  return Object.keys(val).filter(key => val.hasOwnProperty(key))
}