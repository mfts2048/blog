---
title: "effectScope"
update_time: "2022-07-10"
---


## effectScope 基本使用

```typescript
function useCounterOutsideOfComponent() {
    const counter = ref(0)
    // 在 vue 组件的 setup 外使用
    // 以下响应式效果不会被自动清理
    // 将导致内存泄漏
    const doubled = computed(() => counter.value * 2)
    watchEffect(() => {
        console.log(`counter: ${counter.value}`)
    })
    watch(doubled, () => {
        console.log(doubled.value)
    })
    return {
        counter, doubled
    }
}

const state = useCounterOutsideOfComponent()
// 此时需要手动清理响应式效果，代码写的很麻烦
```

改用 `effectScope` 自动收集
```typescript
function useCounterOutsideOfComponent() {
    const scope = effectScope()
    const counter = ref(0)
    // 在 vue 组件的 setup 外使用
    // 以下响应式效果不会被自动清理
    // 将导致内存泄漏
    const doubled = scope.run(() => {
        const doubled = computed(() => counter.value * 2)
        watchEffect(() => {
            console.log(`counter: ${counter.value}`)
        })
        watch(doubled, () => {
            console.log(doubled.value)
        })
        return doubled
    })
    
    const dispose = () => scope.stop()
    return {
        counter, doubled, dispose   
    }
}

const state = useCounterOutsideOfComponent()
state.dispose() // 在其他地方用完以后记得清理
```

## 嵌套模式
```typescript
const scope = effectScope()

const counter = ref(0)
scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    // 外层 scope 关闭时，里层的也会关闭，不需要手动调用里层的 stop()
    effectScope().run(() => {
        watch(doubled, () => console.log(doubled.value))
    })
    watchEffect(() => {
        console.log(`counter: ${counter.value}`)
    })
})

// 清理所有的 响应式效果，包括嵌套的 scopes
scope.stop()
```

## 游离嵌套模式

```typescript
let nestedScope

const parentScope = effectScope()

parentScope.run(() => {
    const doubled = computed(() => counter.value * 2)

    // 里层游离 scope 与外层无关，不会随外层关闭而一起关闭
    nestedScope = effectScope(true)
    nestedScope.run(() => {
        watch(doubled, () => console.log(doubled.value)) 
    })
    watchEffect(() => console.log(`counter: ${counter.value}`))
})

// 清理外层 scope 所有的响应式效果，里层的不会清理
parentScope.stop()
// 清理里层 scope 所有的响应式效果
nestedScope.stop()
```

## EffectScope 关闭事件
```typescript
import { effectScope, onScopeDispose } from 'vue'
const scope = effectScope()

scope.run(() => {
    // 添加当前 scope 关闭时要执行的回调，
    // setup 函数执行时已经有一个为组件打开的 effectScope 了
    // 所以再 setup 函数内部等同于 onUnmounted
    onScopeDispose(() => {
        console.log('cleaned!')
    })
})

scope.stop()
```

## 共享可组合函数
```typescript
function useMouse() {
    const x = ref(0)
    const y = ref(0)

    function handler(e) {
        x.value = e.x
        y.value = e.y
    }

    window.addEventListener('mousemove', handler)
    onUnmounted(() => {
        window.removeEventListener('mousemove', handler)
    })

    return { x, y }
}
```

替换为
```typescript
function useMouse() {
    const x = ref(0)
    const y = ref(0)

    function handler(e) {
        x.value = e.x
        y.value = e.y
    }

    window.addEventListener('mousemove', handler)
    onScopeDispose(() => {
        window.removeEventListener('mousemove', handler)
    })

    return { x, y }
}

function createSharedComposable(composable) {
    let subscribers = 0
    let state, scope

    const dispose = () => {
        if (scope && --subscribers <= 0) {
            scope.stop()
            state = scope = null
        }
    }

    return (...args) => {
        subscribers++
        if (!state) {
            scope = effectScope(true)
            state = scope.run(() => composable(...args))
        }
        // 组件卸载时会关闭内部的 scope，调用 dispose，次数减一，
        // 当次数减到 0 时关闭 scope，并清除缓存的状态
        onScopeDispose(dispose)
        return state
    }
}
// 写成一个管理 effectScope 的工具函数，便于灵活控制 useMouse 调用所属的 scope
// 接收一个可组合函数作为参数，返回一个新的可组合函数
// 工具函数中记录了可组合函数被使用次数
// 第一个调用可组合函数时开一个游离的 scope，
//      可组合函数内部的 onScopeDispose 就不与组件实例相关，调用组合函数后返回缓存的状态
const useSharedMouse = createSharedComposable(useMouse)
```

## 临时 EffectScope
```typescript
import {  } from 'vue'
function useMouse() { /* ... */}
export default defineComponent(function setup() {
    const enabled = ref(false)
    let mouseState, mouseScope

    const dispose = () => {
        mouseScope && mouseScope.stop()
        mouseScope = mouseState = null
    }

    watch(enabled, () => {
        if (enabled.value) {
            mouseScope = effectScope()
            mouseState = mouseScope.run(() => useMouse())
        } else {
            dispose()
        }
    }, { immediate: true })

    onScopeDispose(dispose)

    return () => { /* ... */ }
})
```

## EffectScope 关键源码实现 v3.2.31
```typescript
let activeEffectScope

class EffectScope {
    constructor(detached = false) {
        this.active = true // 标记自己是否还活着
        this.effects = [] // 保存响应式效果实例
        this.cleanups = [] // 保存 onScopeDispose 回调

        if (!detached && activeEffectScope) {
            this.parent = activeEffectScope // 上一级 scope
            // 自己在上级 scope 的子 scopes 数组中的下标
            this.index =
                (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1
        }
    }

    run(fn) {
        if (this.active) {
            try {
                activeEffectScope = this
                // fn 中调用其他响应式 activeEffectScope
                //      会调用 getCurrentScope 和 recordEffectScope 收集响应式效果
                return fn()
            } finally {
                activeEffectScope = this.parent
            }
        }
    }

    stop(fromParent) {
        if (this.active) {
            let i, let
            // 清理所有收集到的响应式效果
            for (i = 0, l = this.effects.length; i < l; i++) {
                this.effects[i].stop()
            }
            // 调用 onScopeDispose 注册的回调
            for (i = 0, l = this.cleanups.lengthl i < l; i++) {
                this.cleanups[i]()
            }
            // 关闭子级 scopes
            if (this.scopes) {
                for (i = 0, l = this.scopes.length; i < l; i++) {
                    this.scopes[i].stop(true)
                }
            }
            // 在上一级 scope 解开对自己的引用
            if (this.parent && !fromParent) {
                // 直接该下标很巧妙， O(1) 的时间复杂度
                // 1. 把最后一个取下来，看看是不是自己，（不管三七二十一，先去下来再说）
                // 2. 比较一下是不是自己
                // 3. 发现不是自己，那就是说找错了位置
                // 4. 既让找错了位置，那就 使用 index 找一下自己位置，
                // 5. 把自己的位置让给 摘下来的 last。
                // （强人所难，亡羊补牢）
                const last = this.parent.scopes.pop()
                if (last && last !== this) {
                    this.parent.scopes[this.index] = last
                    last.index = this.index
                }
            }
            this.active = false
        }
    }
}
function effectScope() {
    return new EffectScope()
}
function recordEffectScope(effect, scope = activeEffectScope) {
    if (scope && scope.active) {
        scope.effects.push(effect)
    }
}
function getCurrentScope() {
    return activeEffectScope
}
function onScopeDispose(fn) {
    if (activeEffectScope) {
        activeEffectScope.cleanups.push(fn)
    }
}
```