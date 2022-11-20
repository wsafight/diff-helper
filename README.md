# diff-helper

[![Build Status](https://www.travis-ci.org/wsafight/diff-helper.svg?branch=main)](https://www.travis-ci.org/wsafight/diff-helper)
[![NPM Version](https://badgen.net/npm/v/diff-helper)](https://www.npmjs.com/package/diff-helper)

基于实际业务的比对辅助库

## 特性

- [x] 基于实际业务的比对
- [x] 支持对象简单比对
- [x] 支持数组进行简单比对
- [x] 支持数组排序比对功能
- [x] 单元测试
- [ ] 更复杂的比对方案


## 安装

```bash
npm install diff-helper
```

或者

```bash
yarn add diff-helper
```

## 用法

### 简单对象比对 simpleObjDiff

#### 参数

| 参数                | 说明                             | 类型                                             | 默认值       |
| :---------------- | :----------------------------- | :--------------------------------------------- | :-------- |
| newVal            | 新对象                            | Record<string,any>                             | -         |
| oldVal            | 老对象                            | Record<string,any>                             | -         |
| options.empty     | 属性删除时的属性值                      | null ｜ ''                                      | null      |
| options.diffFun   | 比对函数，返回为 null 时候使用新对象的数值 | (key: string, newVal: any, oldVal: any) => any | undefined |
| options.needClone | 是否对新属性进行简单（JSON）深拷贝            | boolean                                        | false     |

#### 例子

```ts
import { simpleObjDiff } from 'diff-helper'

simpleObjDiff({
  newVal: {
    b: 1,
    c: 12,
    e: '123',
    f: ['2131', 231, '1111'],
  },
  oldVal: {
     b: 123,
    a: 123213,
    e: '123',
    f: ['2131', 231, '1111'],
  }
});
// => { b: 1, c: 12, a: null }

simpleObjDiff({
  newVal: {
    b: 1,
    c: 12,
  },
  oldVal: {
    b: 123,
    a: 123213,
  },
  options: {
    empty: "",
  },
});
// => { b: 1, c: 12, a: '' }

simpleObjDiff({
  newVal: { a: [12, 3, 4], b: 11 },
  oldVal: { a: [1, 2, 3], c: 22 },
  options: {
     diffFun: (key, newItemVal, oldItemVal) => {
      switch (key) {
        // 处理对象中的属性 a
        case 'a':
          return newItemVal.filter((item: any) => oldItemVal.includes(item));
      }
      return null;
    },
  }
});
// => { a: [3], b: 11, c: null}
```

### 数组比对 simpleListDiff

#### 参数

#### 例子

## Changelog

- 0.0.3 修复了 simpleObjDiff diffFun 返回 false 问题，修改了 simpleObjDiff 传参结构，添加了 isSimpleObjChange 函数
- 0.0.2 基本可用，支持 simpleObjDiff 以及 simpleListDiff
