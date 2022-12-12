---
title: "axios ajax withCredentials"
update_time: "2022-04-03"
---

> https://zhuanlan.zhihu.com/p/65059023

> https://blog.csdn.net/chjj0904/article/details/90268813

### 关于 withCredentials 的小坑

XMLHttpRequest.withCredentials 有什么用?

跨域请求是否提供凭据信息(cookie、HTTP 认证及客户端 SSL 证明等)

也可以简单的理解为，当前请求为跨域类型时是否在请求中协带 cookie。

withCredentials 设置了的时候后端需要添加上相应的域名

#### axios 携带 withCredentials

```typescript
// 俩种都可以
// axios.defaults.withCredentials = true;
const instance = axios.create({
  withCredentials: true,
});

instance({
  url: "http://localhost:3010/",
  method: "GET",
}).then((res) => {
  console.log(res);
});
```

#### 原生 ajax 请求携带 withCredentials

```javascript
const xhr = new XMLHttpRequest();

xhr.open("get", "http://localhost:3010", true);

xhr.withCredentials = true;
xhr.send();

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
```

#### 另外后端需要设置 Access-Control-Allow-Origin 与 Access-Control-Allow-Credentials

```javascript
//设置跨域访问
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  // 这个地方可以动态获取请求的 ip 添加在上面（猜想）
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options")
    res.send(200); //让options尝试请求快速结束
  else next();
});
```
