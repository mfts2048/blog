---
title: "nodejs 检查端口是否有被占用"
update_time: "2022-08-05"
keyword: "nodejs,net,serve"
---

## 使用 net 检测

::: tip
参考 https://github.com/vitejs/vite/blob/main/packages/vite/src/node/http.ts#L151
:::

```typescript
import net from "net";

async function httpServerStart(port: number, host: string, strictPort = false) {
  const httpServer = net.createServer();

  return new Promise((resolve, reject) => {
    const onError = (e: Error & { code?: string }) => {
      if (e.code === "EADDRINUSE") {
        if (strictPort) {
          httpServer.removeListener("error", onError);
          reject(new Error(`Port ${port} is already in use`));
        } else {
          console.log(`Port ${port} is in use, trying another one...`);
          httpServer.listen(++port, host);
        }
      } else {
        httpServer.removeListener("error", onError);
        reject(e);
      }
    };

    httpServer.on("error", onError);

    httpServer.listen(port, host, () => {
      httpServer.removeListener("error", onError);
      resolve(port);
    });
  });
}

async function checkPort() {
  const serverPort = await httpServerStart(5173, "localhost");
  console.log("serverPort", serverPort);
}

checkPort();
```
