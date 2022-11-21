# diff-helper

[![Build Status](https://www.travis-ci.org/wsafight/diff-helper.svg?branch=main)](https://www.travis-ci.org/wsafight/diff-helper)
[![NPM Version](https://badgen.net/npm/v/diff-helper)](https://www.npmjs.com/package/diff-helper)

Read this in other languages: [English](https://github.com/wsafight/diff-helper/blob/main/README.EN.md)

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

### 简单对象比对函数 simpleObjDiff

可以通过该方法获取两个对象不同数据的对比结果。也可以传入 diffFun 提供更加复杂的属性 diff。

#### 参数

| 参数 | 说明 | 类型 | 默认值 |
| :-- | :--| :-- | :-- |
| newVal | 新对象 | Record<string,any> | - |
| oldVal | 老对象 | Record<string,any> | - |
| options.empty | 属性删除时的属性值 | null ｜ '' | null |
| options.diffFun | 比对函数，返回为 null 时候使用新对象的数值 | (key: string, newVal: any, oldVal: any) => any | undefined |
| options.needClone | 是否对新属性进行简单（JSON）深拷贝 | boolean | false |

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
    diffFun: (key, newItemVal, oldItemVal) => {
      switch (key) {
        // 处理对象中的属性 a
        case "a":
          return newItemVal.filter((item: any) => oldItemVal.includes(item));
      }
      return null;
    },
  },
});
// => { a: [3], b: 11, c: null}
```

### 数组比对函数 simpleListDiff

可以通过该方法获取两个数据行的对比结果。需要传递 getChangedItem 函数获取修改的数据以便使用。

#### 参数

| 参数 | 说明 | 类型 | 默认值 |
| :-- | :--| :-- | :-- |
| newVal | 新数组 | any[] | - |
| oldVal | 老数组 | any[] | - |
| options.getChangedItem | 比对函数，返回为 null 则认为没有修改，否则返回两个对象的差异值 | ({newLine, oldLine}) => any | ({newLine}) => newLine |
| options.key | 主键,对象判定的唯一值 | string | 'id' |
| options.isSplit | 是否进行拆分，不拆分则是一个携带 rowState 的对象数组 | boolean | true |
| options.fields | 多返回的数据,isSplit 不为 false 时候一般不需要改参数 | ['addedCount','deletedCount', 'modifiedCount'] | [] |

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
    // 获取修改之后的参数
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
    getChangedItem: ({
      newLine,
      oldLine,
    }) => {
      const result = simpleObjDiff({
        newVal: newLine,
        oldVal: oldLine,
      });
      if (!Object.keys(result).length) {
        return null;
      }
      return { id: newLine.id, ...result };
    },
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
  newVal: [{ id: 1, cc: "bbc" }, { bb: "123" }],
  oldVal: [{ id: 1, cc: "bb" }, { id: 2, cc: "bdf" }],
  options: {
    getChangedItem: ({
      newLine,
      oldLine,
    }) => {
      const result = simpleObjDiff({
        newVal: newLine,
        oldVal: oldLine,
      });
      if (!Object.keys(result).length) {
        return null;
      }
      return { id: newLine.id, ...result };
    },
    key: "id",
    // 是否进行拆分
    isSplit: false,
  },
});
// 不进行拆分，获取一个单独的数组，rowState 分别为 added deleted modified
result = {
  lines: [
    {
      id: 1,
      cc: "bbc",
      rowState: "modified",
    },
    {
      bb: "123",
      rowState: "added",
    },
    {
      id: 2,
      rowState: "deleted",
    },
  ],
};

simpleListDiff({
  newVal: [{ id: 1, cc: "bbc" }, { bb: "123" }],
  oldVal: [{ id: 1, cc: "bb" }, { id: 2, cc: "bdf" }],
  options: {
    getChangedItem: ({
      newLine,
      oldLine,
    }) => {
      const result = simpleObjDiff({
        newVal: newLine,
        oldVal: oldLine,
      });
      if (!Object.keys(result).length) {
        return null;
      }
      return { id: newLine.id, ...result };
    },
    key: "id",
    // 是否进行拆分
    isSplit: false,
    // 多携带的数据
    fields: ["addedCount", "modifiedCount", "deletedCount"],
  },
});
// 可以多获取到添加数量，修改数量以及删除数量
result = {
  lines: [
    {
      id: 1,
      cc: "bbc",
      rowState: "modified",
    },
    {
      bb: "123",
      rowState: "added",
    },
    {
      id: 2,
      rowState: "deleted",
    },
  ],
  addedCount: 1,
  modifiedCount: 1,
  deletedCount: 2,
};
```

### 数组排序比对函数 simpleListDiffWithSort

可以通过该方法获取两个数据行的对比结果。同时也保持了排序之后的信息。

#### 参数

| 参数 | 说明 | 类型 | 默认值 |
| :-- | :--| :-- | :-- |
| newVal | 新数组 | any[] | - |
| oldVal | 老数组 | any[] | - |
| options.getChangedItem | 比对函数，返回为 null 则认为没有修改，否则返回两个对象的差异值 | ({newLine, oldLine}) => any | ({newLine}) => newLine |
| options.key | 主键,对象判定的唯一值 | string | 'id' |
| options.fields | 多返回的数据 | ['addedCount','deletedCount', 'modifiedCount'] | [] |

#### 例子

```ts
simpleListDiffWithSort({
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
    getChangedItem: ({
      newLine,
      oldLine,
    }) => {
      const result = simpleObjDiff({
        newVal: newLine,
        oldVal: oldLine,
      });
      if (!Object.keys(result).length) {
        return null;
      }
      return { id: newLine.id, ...result };
    },
    key: "id",
  },
});
// 由于需要排序，没有进行拆分，会携带 sortChanged 参数
result = {
  lines: [{
    cc: "bbc",
    id: 1,
    rowState: "modified",
  }, {
    bb: "123",
    rowState: "added",
  }, {
    id: 2,
    rowState: "deleted",
  }],
  sortChanged: true,
};

simpleListDiffWithSort({
  newVal: [{ id: 2, cc: "bdf" }, { id: 3, bb: "333" }, { id: 1, cc: "bb" }],
  oldVal: [{ id: 1, cc: "bb" }, { id: 3, bb: "333" }, { id: 2, cc: "bdf" }],
  options: {
    // 此时可以获取数量
    fields: [
      "addedCount",
      "modifiedCount",
      "deletedCount",
    ],
    getChangedItem: ({
      newLine,
      oldLine,
    }) => {
      const result = simpleObjDiff({
        newVal: newLine,
        oldVal: oldLine,
      });
      if (!Object.keys(result).length) {
        return null;
      }
      return { id: newLine.id, ...result };
    },
    key: "id",
  },
});
// 此时没有任何增加，删除，修改，只有顺序修改
result = {
  lines: [{
    id: 2,
    rowState: "noChange",
  }, {
    id: 3,
    rowState: "noChange",
  }, {
    id: 1,
    rowState: "noChange",
  }],
  addedCount: 0,
  modifiedCount: 0,
  deletedCount: 0,
  sortChanged: true,
};

simpleListDiffWithSort({
  newVal: [{ bb: "123" }, { id: 1, cc: "bbc" }],
  oldVal: [{ id: 1, cc: "bb" }, { id: 3, cc: 234 }, { id: 2, cc: "bdf" }],
  options: {
    getChangedItem: ({
      newLine,
      oldLine,
    }) => {
      const result = simpleObjDiff({
        newVal: newLine,
        oldVal: oldLine,
      });
      if (!Object.keys(result).length) {
        return null;
      }
      return { id: newLine.id, ...result };
    },
    key: "id",
  },
});
// 当前顺序会根据 newVal 的值来决定顺序，删除会在最后
result = {
  lines: [{
    bb: "123",
    rowState: "added",
  }, {
    cc: "bbc",
    id: 1,
    rowState: "modified",
  }, {
    id: 3,
    rowState: "deleted",
  }, {
    id: 2,
    rowState: "deleted",
  }],
  addedCount: 1,
  modifiedCount: 1,
  deletedCount: 2,
  sortChanged: true,
};
```

## Changelog
- 0.0.4 添加了 simpleListDiff 和 simpleListDiffWithSort 函数以及测试

- 0.0.3 修复了 simpleObjDiff diffFun 返回 false 问题，修改了 simpleObjDiff 传参结构，添加了
  isSimpleObjChange 函数
  
- 0.0.2 基本可用，支持 simpleObjDiff 以及 simpleListDiff
