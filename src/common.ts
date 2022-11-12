import { EmptyVal, getOwnKeysForObj, isDate, isEmpty, isObject, isRealObject } from "./utils"

const _coreDiff = (newVal: any, oldVal: any,  empty: EmptyVal = null): any => {
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
			const difference = _coreDiff((oldVal as any)[key], (newVal as any)[key], empty)
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

export const coreDiff = <T>(newVal: T, oldVal: T, empty?: EmptyVal) => _coreDiff(oldVal, newVal, empty)

interface simpleDiffObjOptions {
	empty?: EmptyVal
  diffFun?: (diffObj: any, key: string, newVal: any, oldVal: any) => boolean
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

    if (hasDiffFun && diffFun(diffFun, key, newVal[key], oldVal[key])) {
      isChanged = true
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