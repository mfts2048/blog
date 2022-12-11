---
title: "关于视频切片"
update_time: "2022-03-21"
---

### 移动端 iOS 设置 video 的 currentTime 无效解决方法

> https://blog.csdn.net/xh17864388739/article/details/122560947

ios 直接赋值 currentTime 无效，原因就是判断资源可播放时（canplay）再设置才可以, 所以要根据不同系统判断一下

```javascript
const isAndroid = () => {
  const u = navigator.userAgent;
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    return true;
  }
  return false;
}

const videoRef = /* video dom */;
if (isAndroid()) {
  videoRef.currentTime = /* 设置时间 */ ?? 0;
} else {
  videoRef.addEventListener("canplay", () => {
    try {
      if (videoRef.currentTime === 0) {
        videoRef.currentTime = /* 设置时间 */ ?? 0;
      }
    } catch (error) {
      console.warn("@VideoRef: set currentTime", error);
    }
  });
}
```

### nodejs 生成 m3u8 然后用 html 播放

> https://nextjs-markdown-sigma.vercel.app/posts/nodejs%20%E7%94%9F%E6%88%90m3u8%E7%84%B6%E5%90%8E%E7%94%A8html%E6%92%AD%E6%94%BE

### 视频切片的后期注意事项

这天发现前端不止使用 m3u8 才可以支持切片

例如使用 mp4 文件的时候依旧可以享受切片带来的效果，但是并不是前端进行操作，是由后端进行处理

mp4 会持续的发送请求，发送关于请求的时间节点，并且后端返回的请求状态一直为 [206](https://www.cnblogs.com/simonbaker/p/5190675.html)

> https://www.cnblogs.com/simonbaker/p/5190675.html
