---
title: "Prose"
---

```typescript
// 检查是否是文件夹
import fs from 'fs'
export function isDirectory(filePath: string) {
    const stat = fs.lstatSync(filePath)
    return stat.isDirectory()
}
```

```css
/* 省略 ... */
.sl-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.ml-ellipsis {
	display: -webkit-box;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
}
```

```typescript
// 递归删除文件夹及子目录
import fs from 'fs'
import rimraf from 'rimraf'
fs.rmdirSync(tempDir, { recursive: true });
// rimraf.sync 报错，所以这里不使用同步
rimraf(tempDir, () => { });
```

```typescript
// 数据一次性读入内存再进行的返回
function fsReadFile() {
    const body = fs.readFileSync('./input.txt');
    return body
}
```

```typescript
//读取input.txt文件内容，并将内容写入到output.txt文件中(原内容会被替换)
const readStream = fs.createReadStream('./input.txt');
const writeStream = fs.createWriteStream('./output.txt');
readStream.pipe(writeStream)
console.log('程序执行完毕')
```