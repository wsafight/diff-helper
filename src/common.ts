import { isDate, isEmpty, isObject } from "./utils"

export const coreDiff = (oldValue: any, newValue: any): any => {
	if (oldValue === undefined || oldValue === '') {
		oldValue = null
	}
	if (newValue === undefined || newValue === '') {
		newValue = null
	}

	if (oldValue === newValue) {
		return null
	}

	if (!isObject(oldValue) || !isObject(newValue)) {
		return newValue
	}

	if (isDate(oldValue) || isDate(newValue)) {
		if (oldValue.valueOf() === newValue.valueOf()) {
			return null
		}
		return newValue
	}

	const diffResult: any = {}
	Object.keys(newValue).forEach(key => {
		if (isEmpty(newValue[key])) {
			return
		}
		if (isEmpty(oldValue[key])) {
			diffResult[key] = newValue[key]
		} else {
			const difference = coreDiff((oldValue as any)[key], (newValue as any)[key])
			if (difference !== null) {
				diffResult[key] = difference
			}
		}
	})
	Object.keys(oldValue).forEach(key => {
		if (!isEmpty(oldValue[key]) && isEmpty(newValue[key])) {
			diffResult[key] = ''
		}
	})
	return Object.keys(diffResult).length ? diffResult : null
}

