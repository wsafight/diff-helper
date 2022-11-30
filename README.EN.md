# diff-helper

[![Build Status](https://www.travis-ci.org/wsafight/diff-helper.svg?branch=main)](https://www.travis-ci.org/wsafight/diff-helper)
[![NPM Version](https://badgen.net/npm/v/diff-helper)](https://www.npmjs.com/package/diff-helper)


Comparison auxiliary library based on actual business

## Features

- [x] Comparison based on actual business
- [x] Support simple comparison of objects
- [x] Support arrays for simple comparison
- [x] Support array sorting and comparison function
- [x] unit test
- [ ] More complex alignment schemes

## Install

```bash
npm install diff-helper
```

Or

```bash
yarn add diff-helper
```

## Usage

### simple object comparison function simpleObjDiff

This method can be used to obtain the comparison results of different data of two objects. You can also pass in diffFun to provide more complex attribute diff.

#### parameter

| parameter | desc | type | default |
| :-- | :--| :-- | :-- |
| newVal | new object | Record<string,any> | - |
| oldVal | old object | Record<string,any> | - |
| options.empty | The attribute value when the attribute is deleted | null ｜ '' | null |
| options.diffFun | Comparison function, use the value of the new object when the return is null | (key: string, newVal: any, oldVal: any) => any | undefined |
| options.needClone | Whether to do a simple (JSON) deep copy of new properties | boolean | false |

#### example

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

### array comparison function simpleListDiff

This method can be used to obtain the comparison result of two data rows. You need to pass the getChangedItem function to get the modified data for use.

#### parameter

| parameter |desc  | type  | default |
| :-- | :--| :-- | :-- |
| newVal | new array | any[] | -  |
| oldVal | old array | any[] | -  |
| options.getChangedItem | Comparison function, if it returns null, it is considered that there is no modification, otherwise it returns the difference value of the two objects | ({newLine, oldLine}) => any | ({newLine, oldLine}) => diff(newLine, oldLine) |
| options.key | 
Primary key, the unique value determined by the object | string | 'id' |
| options.sortName | Sorting name, the data will be inserted into the object array (index+1) | string | '' |

#### example

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
    // To get the modified parameters, the default function is similar to the following code
    getChangedItem: ({
      newLine,
      oldLine,
    }) => {
      // Use simpleObjDiff
      // You can also write by hand for the current object newLine.cc !== oldLine.cc
      const result = simpleObjDiff({
        newVal: newLine,
        oldVal: oldLine,
      });
      // There is currently no data modification, return null
      if (!Object.keys(result).length) {
        return null;
      }
      // Return the result carrying the primary key as the modified item
      return { id: newLine.id, ...result };
    },
    // The primary key is id
    key: "id",
  },
});
// No additions, modifications and deletions
result = {
  addedLines: [],
  deletedLines: [],
  modifiedLines: [],
};

// You can not pass getChangedItem. SimpleObjDiff is used by default
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
    // The primary key is id
    key: "id",
  },
});
// No additions, modifications and deletions
result = {
  addedLines: [],
  deletedLines: [],
  modifiedLines: [],
};

// getChangedItem may not be passed. By default simpleObjDiff is used
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
// Return the added, deleted and modified data respectively
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
// Only the positions of 1 and 3 have changed
result = {
  addedLines: [],
  deletedLines: [],
  modifiedLines: [],
  // The location information is provided here. The middle 3 has not changed and will not be processed
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
// It also supports adding sortIndex for new and modified data
result = {
  addedLines: [
    {
      id: 2,
      cc: "bbc",
      // The new data is currently numbered 1
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
- 1.0.0 Remove the simpleListDiffWithSort function and remove unnecessary parameters in the simpleListDiff function

- 0.0.5 Configure available default items for options.getChangedItem of simpleListDiff and simpleListDiffWithSort

- 0.0.4 Added simpleListDiff and simpleListDiffWithSort functions and tests

- 0.0.3 Fixed the problem that simpleObjDiff diffFun returned false, modified the simpleObjDiff parameter passing structure, and added isSimpleObjChange function
  
- 0.0.2 Basically available, support simpleObjDiff and simpleListDiff
