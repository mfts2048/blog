---
title: "@vueuse"
update_time: "2022-03-21"
---

### 全屏 useFullscreen

写这个主要是他兼容 esc 按钮和 f11 按钮，非常好用

```typescript
import { useFullscreen } from "@vueuse/core";

const domRef = ref<Nullable<HTMLElement>>(null);
const { enter, toggle, exit, isFullscreen } = useFullscreen();
const { toggle: toggleDom } = useFullscreen(domRef);
```
