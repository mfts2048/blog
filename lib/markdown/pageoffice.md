---
title: "Pageoffice"
update_time: "2022-05-27"
---

:::tip 参考

https://blog.csdn.net/amnesiac666/article/details/124087840
:::

问题表现：

pageoffice 已经安装在本地，且在本地可以被打开，但是线上却打不开

线上点击打开 pageoffice 的流程是点击访问 http://127.0.0.1:57070/json.html?x=7573E3A2(POST) 来判断本地是否已经安装这个软件

但是在请求的时候发现请求并没有成功的执行，且控制台报错。

```
关于 chrome 升级后出现问题（其他浏览器暂时不会出现）

chrome 系浏览器报错跨域问题：

has been blocked by CORS policy: 
The request client is not a secure context and the resource is in more-private address space private

官网:https://wicg.github.io/private-network-access/
```

### 问题原因: 公网资源(访问者) 访问 私网资源(被访问者)

解决方案:

- 两种资源都改成 https

- 做代理或改 dns 两种资源都改成 内网或者外网 ip

- 配置 chrome 选项为 disable chrome://flags/#block-insecure-private-network-requests (自测可以)

- 访问者资源加响应头 Access-Control-Allow-Private-Network

## 文书空白页面展示

基本上算是 Expires OSSAccessKeyId Signature 中有一个传递给后端的时候异常

### 问题原因: Signature 后端传递的网址链接上带有 `%2B` 或者 `+`

:::tip 参考

https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20

https://github.com/sindresorhus/query-string/issues/305

https://blog.csdn.net/laihongfeng/article/details/123116826
:::
![](/Snipaste_2022-09-20_16-54-09.png)