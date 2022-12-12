---
title: "http服务基础模板"
update_time: "2022-03-26"
keyword: "nodejs,serve"
---

```javascript
const http = require("http");
const server = http.createServer();

server.on("request", (request, response) => {
  const { url } = request;

  if (url === "/addMessage") {
    response.writeHead(200, {
      "Content-Type": "text/html;charset=utf-8",
    });
    response.end("/addMessage");
    return;
  }

  response.writeHead(200, {
    "Content-Type": "text/html;charset=utf-8",
  });
  response.end("/");
});

server.listen(3000, () => {
  console.log("Server is running at http://127.0.0.1:3000/");
});
```
