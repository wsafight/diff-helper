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

export const isEmptyForInput = (val: any) => {
    return val === null || val === undefined || val === ''
}