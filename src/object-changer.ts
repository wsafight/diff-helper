import { getOwnKeysForObj, isEmpty } from "./utils"

export class ObjectChanger {
  readonly object: Record<string, any>
  private _inital: Record<string, any> = {} 
  constructor(object: Record<string, any>) {
    this.object = object
    this.acceptChange()
  }

  acceptChange() {
    this._inital = {}
    getOwnKeysForObj(this.object).forEach(key => {
      const value = this.object[key]
      this._inital[key] = value ? JSON.stringify(value) : value
    })
  }

  cancelChange() {
    const initalKeys = getOwnKeysForObj(this._inital)
    initalKeys.forEach(key => {
      const value = this._inital[key]
      this.object[key] = value ? JSON.parse(value) : value
    })
    getOwnKeysForObj(this.object).forEach(key => {
      if (initalKeys.includes(key)) {
        delete this.object[key]
      }
    })
  }
  isChanged() {
    return !this._visitChangedItem()
  }
  getChangedObject() {
    const changedObject: Record<string, any> = {}
    this._visitChangedItem((key: string, value: any, reason: string) => {
      if (reason === 'modified') {
        changedObject[key] = value
      } else {
        changedObject[key] = value ? JSON.parse(value) : value
      }
      return true
    })
    return changedObject
  }
  filterEmpty() {
    const ret: Record<string, any> = {}
    getOwnKeysForObj(this.object).forEach(key => {
      const newValue = this.object[key]
      if (!isEmpty(newValue)) {
        ret[key] = newValue
      }
    })
    return ret
  }

  /**
   * 遍历已修改的项目
   * @param visitor 为NULL或返回false时，终止执行
   * @returns {boolean} 遍历过程中终止的场合返回false，否则返回true
   * @private
   */
  _visitChangedItem(visitor?: Function) {
    const checkedKeys: Set<string> = new Set()
    const keys = getOwnKeysForObj(this.object)
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]
      checkedKeys.add(key)
      let newValue = this.object[key]
      newValue = newValue ? JSON.stringify(newValue) : newValue
      if (newValue !== this._inital[key]) {
        if (!visitor) {
          return false
        }
        if (!visitor(key, this.object[key], 'modified')) {
          return false
        }
      }
    }
    const initialKeys = getOwnKeysForObj(this._inital)
    for (let i = 0, len = initialKeys.length; i < len; i++) {
      const key = initialKeys[i]
      if (!checkedKeys.has(key)) {
        if (!visitor) {
          return false
        }
        if (!visitor(key, this._inital[key], 'deleted')) {
          return false
        }
      }
    }
    return true
  }
}
