---
title: "esbuild自定义插件"
update_time: "2022-03-27"
---

### esbuild 自定义插件，读取引用的地址并返回

```javascript
const esbuild = require('esbuild')
const axios = require('axios')
const MyPlugin = {
    name: "http-url",
    setup(build) {
        build.onResolve({
            filter: /^https?:\/\//
        }, args => {
            return {
                path: args.path,
                namespace: "http-url"
            }
        })

        build.onResolve({
            filter: /.*/,
            namespace:
        }, args => {

        })

        build.onLoad({
            filter: /.*/,
            namespace: 'http-url'
        }, async args => {
            const { data } = await axios(args.path)
            return {
                contents: data
            }
        })
    }
}
esbuild.build({
    entryPoints: ["app.js"],
    bundle: true,
    outfile: "out.js",
    plugins: [MyPlugin]
})
```

app.js

```javascript
import { add } from "https://unpkg.com/lodash-es@4.17.15/lodash.js";
console.log(add);
```
