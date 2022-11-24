import {
  ARRAY_TYPE,
  basicDiffParams,
  FUNCTION_TYPE,
  getType,
  OBJECT_TYPE,
} from "./utils"

type JSONIncrementDiffParams = basicDiffParams<Record<string, any> | any[]>

function syncKeys({ newVal, oldVal }: JSONIncrementDiffParams) {
  if (newVal === oldVal) {
    return
  }

  const rootCurrentType = getType(newVal)
  const rootPreType = getType(oldVal)

  if (rootCurrentType == OBJECT_TYPE && rootPreType == OBJECT_TYPE) {
    for (let key in oldVal) {
      const currentValue = (newVal as Record<string, any>)[key]
      if (currentValue === undefined) {
        (newVal as Record<string, any>)[key] = null
      } else {
        syncKeys({
          newVal: currentValue,
          oldVal: (oldVal as Record<string, any>)[key]
        })
      }
    }
  } else if (rootCurrentType == ARRAY_TYPE && rootPreType == ARRAY_TYPE) {
    if (newVal.length >= oldVal.length) {
      oldVal.forEach((item: any, index: number) => {
        syncKeys({
          newVal: (newVal as any[])[index],
          oldVal: item
        })
      })
    }
  }
}

interface diffParms extends basicDiffParams<any[] | Record<string, any>> {
  path: string
  result: Record<string, any>
}

const _diff = ({
  newVal,
  oldVal,
  path,
  result
}: diffParms) => {
  if (newVal === oldVal) {
    return
  }
  const rootCurrentType = getType(newVal)
  const rootPreType = getType(oldVal)
  if (rootCurrentType === OBJECT_TYPE) {
    if (rootPreType != OBJECT_TYPE || Object.keys(newVal).length < Object.keys(oldVal).length && path !== '') {
      setResult(result, path, newVal)
    } else {
      for (let key in newVal) {
        const currentValue = (newVal as Record<string, any>)[key]
        const preValue = (oldVal as Record<string, any>)[key]
        const currentType = getType(currentValue)
        const preType = getType(preValue)
        if (currentType != ARRAY_TYPE && currentType != OBJECT_TYPE) {
          if (currentValue !== (oldVal as Record<string, any>)[key]) {
            setResult(result, concatPathAndKey(path, key), currentValue)
          }
        } else if (currentType == ARRAY_TYPE) {
          if (preType != ARRAY_TYPE) {
            setResult(result, concatPathAndKey(path, key), currentValue)
          } else {
            if (currentValue.length < preValue.length) {
              setResult(result, concatPathAndKey(path, key), currentValue)
            } else {
              currentValue.forEach((item: any, index: number) => {
                _diff({
                  newVal: item,
                  oldVal: preValue[index],
                  path: concatPathAndKey(path, key) + '[' + index + ']',
                  result,
                })
              })
            }
          }
        } else if (currentType == OBJECT_TYPE) {
          if (preType != OBJECT_TYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(result, concatPathAndKey(path, key), currentValue)
          } else {
            for (let subKey in currentValue) {
              const realPath = concatPathAndKey(path, key) + (subKey.includes('.') ? `["${subKey}"]` : `.${subKey}`)
              _diff({
                newVal: currentValue[subKey],
                oldVal: preValue[subKey],
                path: realPath,
                result,
              })
            }
          }
        }
      }
    }
  } else if (rootCurrentType === ARRAY_TYPE) {
    if (rootPreType !== ARRAY_TYPE) {
      setResult(result, path, newVal)
    } else {
      if (newVal.length < oldVal.length) {
        setResult(result, path, newVal)
      } else {
        newVal.forEach((item: any, index: number) => {
          _diff({
            newVal: item,
            oldVal: (oldVal as any[])[index],
            path: path + '[' + index + ']',
            result,
          })
        })
      }
    }
  } else {
    setResult(result, path, newVal)
  }
}

function concatPathAndKey(path: string, key: string) {
  return key.includes('.')
    ? path + `["${key}"]`
    : (path == '' ? '' : path + ".") + key
}

function setResult(result: Record<string, any>, k: string, v: any) {
  if (getType(v) !== FUNCTION_TYPE) {
    result[k] = v
  }
}

export const JSONIncrementDiff = ({
  newVal,
  oldVal,
}: JSONIncrementDiffParams): Record<string, any> => {
  const result = {}
  if (!oldVal) {
    return newVal
  }
  syncKeys({
    newVal,
    oldVal,
  })
  _diff({
    newVal,
    oldVal,
    path: '',
    result,
  })
  return result
}