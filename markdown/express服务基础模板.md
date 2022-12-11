---
title: "express服务基础模板"
update_time: "2020-01-01"
keyword: "nodejs"
---

```javascript
const express = require("express");
const path = require("path");

const app = express();

//设置跨域访问
app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  // res.header("Access-Control-Allow-Origin","http://localhost:3000");
  res.header("Access-Control-Allow-Origin","http://localhost:3000");
  res.header("Access-Control-Allow-Credentials",true);
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
      res.send(200);  //让options尝试请求快速结束
  else
      next();
})

app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  // res.send(path.resolve(__dirname, "./static/index.html"));
  res.json({
    data: 200
  })
});

app.listen(3010, () => {
  console.log("http://localhost:3010");
});
```
