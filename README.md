# diff-helper

[![Build Status](https://www.travis-ci.org/wsafight/diff-helper.svg?branch=main)](https://www.travis-ci.org/wsafight/diff-helper)
[![NPM Version](https://badgen.net/npm/v/diff-helper)](https://www.npmjs.com/package/diff-helper)

Read this in other languages:
[English](https://github.com/wsafight/diff-helper/blob/main/README.EN.md)

基于实际业务的比对辅助库

开发历程可以参考博客 [手写一个业务数据比对库](https://github.com/wsafight/personBlog/issues/49)

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

### 简单对象比对函数 simpleObjDiff

可以通过该方法获取两个对象不同数据的对比结果。也可以传入 diffFun 提供更加复杂的属性 diff。

#### 参数

| 参数                | 说明                       | 类型                                             | 默认值       |
| :---------------- | :----------------------- | :--------------------------------------------- | :-------- |
| newVal            | 新对象                      | Record<string,any>                             | -         |
| oldVal            | 老对象                      | Record<string,any>                             | -         |
| options.empty     | 属性删除时的属性值                | null ｜ ''                                      | null      |
| options.diffFun   | 比对函数，返回为 null 时候使用新对象的数值 | (key: string, newVal: any, oldVal: any) => any | undefined |
| options.needClone | 是否对新属性进行简单（JSON）深拷贝      | boolean                                        | false     |

#### 例子

```ts
import { simpleObjDiff } from "diff-helper";

simpleObjDiff({
  newVal: {
    b: 1,
    c: 12,
    e: "123",
    f: ["2131", 231, "1111"],
  },
  oldVal: {
    b: 123,
    a: 123213,
    e: "123",
    f: ["2131", 231, "1111"],
  },
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
    diffFun: ({
      key,
      newPropVal,
      oldPropVal,
    }) => {
      switch (key) {
        // 处理对象中的属性 a
        case "a":
          return newPropVal.filter((item: any) => oldPropVal.includes(item));
      }
      // 其他我们选择不处理，使用默认的 JSON.stringify
      return null;
    },
  },
});
// => { a: [3], b: 11, c: null}
```

### 数组比对函数 simpleListDiff

可以通过该方法获取两个数据行的对比结果。需要传递 getChangedItem 函数获取修改的数据以便使用。

#### 参数

| 参数                     | 说明                                 | 类型                          | 默认值                                            |
| :--------------------- | :--------------------------------- | :-------------------------- | :--------------------------------------------- |
| newVal                 | 新数组                                | any[]                       | -                                              |
| oldVal                 | 老数组                                | any[]                       | -                                              |
| options.getChangedItem | 比对函数，返回为 null 则认为没有修改，否则返回两个对象的差异值 | ({newLine, oldLine}) => any | ({newLine, oldLine}) => diff(newLine, oldLine) |
| options.key            | 主键,对象判定的唯一值                        | string                      | 'id'                                           |
| options.sortName       | 排序名称，会在对象数组中插入该数据(index + 1)       | string                      | ''                                             |

#### 例子

```ts
simpleListDiff({
  newVal: [{
    id: 1,
    cc: "bb",
  }],
  oldVal: [{
    id: 1,
    cc: "bb",
  }],
  options: {
    // 获取修改之后的参数，默认函数类似使用了如下代码
    getChangedItem: ({
      newLine,
      oldLine,
    }) => {
      // 使用 simpleObjDiff
      // 针对当前对象也可以手写 newLine.cc !== oldLine.cc
      const result = simpleObjDiff({
        newVal: newLine,
        oldVal: oldLine,
      });
      // 当前没有任何数据修改，返回 null
      if (!Object.keys(result).length) {
        return null;
      }
      // 返回携带主键的结果作为修改之后的项目
      return { id: newLine.id, ...result };
    },
    // 主键为 id
    key: "id",
  },
});
// 没有任何添加修改和删除
result = {
  addedLines: [],
  deletedLines: [],
  modifiedLines: [],
};

// 可以不传递 getChangedItem。默认使用了 simpleObjDiff
simpleListDiff({
  newVal: [{
    id: 1,
    cc: "bb",
  }],
  oldVal: [{
    id: 1,
    cc: "bb",
  }],
  options: {
    // 主键为 id
    key: "id",
  },
});
// 没有任何添加修改和删除
result = {
  addedLines: [],
  deletedLines: [],
  modifiedLines: [],
};

simpleListDiff({
  newVal: [{
    id: 1,
    cc: "bbc",
  }, {
    bb: "123",
  }],
  oldVal: [{
    id: 1,
    cc: "bb",
  }, {
    id: 2,
    cc: "bdf",
  }],
  options: {
    key: "id",
  },
});
// 分别把增删改的数据都返回
result = {
  addedLines: [{ bb: "123" }],
  deletedLines: [{ id: 2 }],
  modifiedLines: [{ id: 1, cc: "bbc" }],
};

simpleListDiff({
  newVal: [
    { id: 2, cc: "bdf" },
    { id: 3, bb: "333" },
    { id: 1, cc: "bb" },
  ],
  oldVal: [
    { id: 1, cc: "bb" },
    { id: 3, bb: "333" },
    { id: 2, cc: "bdf" },
  ],
  options: {
    key: "id",
    sortName: "sortIndex",
  },
});
// 只有 1 和 3 的位置发生了改变
result = {
  addedLines: [],
  deletedLines: [],
  modifiedLines: [],
  // 这里有位置的信息提供,中间的 3 没有任何改动，不做处理
  noChangeLines: [{
    id: 2,
    sortIndex: 1,
  }, {
    id: 1,
    sortIndex: 3,
  }],
};

simpleListDiff({
  newVal: [{ id: 2, cc: "bbc" }, { id: 1, cc: "bb" }],
  oldVal: [{ id: 1, cc: "bb" }],
  options: {
    key: "id",
    sortName: "sortIndex",
  },
});
// 同样也支持为新增和修改的数据添加 sortIndex
result = {
  addedLines: [
    {
      id: 2,
      cc: "bbc",
      // 新增的数据目前序号为 1
      sortIndex: 1,
    },
  ],
  noChangeLines: [{
      id: 1,
      sortIndex: 2,
  },],
  deletedLines: [],
  modifiedLines: [],
};
```

## Changelog

- 1.0.0 移除 simpleListDiffWithSort 函数以及 simpleListDiff 函数中的不必要的参数

- 0.0.5 为 simpleListDiff 和 simpleListDiffWithSort 的 options.getChangedItem
  配置可用的默认项

- 0.0.4 添加了 simpleListDiff 和 simpleListDiffWithSort 函数以及测试

- 0.0.3 修复了 simpleObjDiff diffFun 返回 false 问题，修改了 simpleObjDiff 传参结构，添加了
  isSimpleObjChange 函数

- 0.0.2 基本可用，支持 simpleObjDiff 以及 simpleListDiff
