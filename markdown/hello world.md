---
title: "effectScope"
update_time: "2022-07-10"
keyword: 'nodejs'
---


## effectScope 基本使用

```typescript
function useCounterOutsideOfComponent() {
    const counter = ref(0)
    const doubled = computed(() => counter.value * 2)
    watchEffect(() => {
        console.log(`counter: ${counter.value}`)
    })
    watch(doubled, () => {
        console.log(doubled.value)
    })
    return { counter, doubled }
}

const state = useCounterOutsideOfComponent()
// 此时需要手动清理响应式效果，代码写的很麻烦
```
