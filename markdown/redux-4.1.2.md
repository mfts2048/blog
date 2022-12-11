---
title: "redux-4.1.2"
update_time: "2022-03-21"
---

> https://github.com/reduxjs/redux

### createStore.ts

- 使用函数的好处在于外部不能直接修改其中的 **currentState** 数据

- **dispatch** 是唯一能修改其中数据的一个方法

```typescript
if (currentListeners === nextListeners) {
  nextListeners = currentListeners.slice();
}
```

- 使用 **slice()** 拷贝数据是防止用户在 **reducer** 正在执行的时候对函数集进行增删，出现一些奇怪的问题。当 **currentListeners** 和 **nextListeners** 相同时则 **nextListeners** 是 **currentListeners** 的引用，所以需要拷贝一份。判断一下再 **slice()** 也是为了减少 **slice()** 的次数

- 事件触发循环用 **currentListeners**， 事件绑定/解绑用 **nextListeners**，并且只在必要时 **slice()**

### reference

> https://www.bilibili.com/video/BV1bU4y1E7s8/?spm_id_from=333.788

> https://www.zhihu.com/question/42202871

> http://www.ayqy.net/blog/redux%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/
