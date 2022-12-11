---
title: "node生成m3u8"
update_time: "2022-03-21"
---

> https://zhuanlan.zhihu.com/p/433937634

安装依赖

```shell
npm install express --save
npm install fluent-ffmpeg
npm install --save @ffmpeg-installer/ffmpeg
```

完整代码

```javascript
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const express = require("express");
const path = require("path");
const app = express();
const port = 3030;
app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/get", (req, res) => {
  let filePath = path.join(__dirname, "./static/ForeverAi.mp4"); // 视频地址

  ffmpeg(filePath)
    .videoCodec("libx264") // 设置视频编解码器
    // .audioCodec('libfaac') // 设置 音频解码器
    .format("hls") // 输出视频格式
    .outputOptions("-hls_list_size 0") //  -hls_list_size n:设置播放列表保存的最多条目，设置为0会保存有所片信息，默认值为5
    .outputOption("-hls_time 5") // -hls_time n: 设置每片的长度，默认值为2。单位为秒
    .output(path.join(__dirname, "./static/ForeverAi.m3u8")) // 输出文件
    .on("progress", (progress) => {
      // 监听切片进度
      console.log("Processing: " + progress.percent + "% done");
    })
    .on("end", () => {
      // 监听结束
      console.log("视频切片完成");
    })
    .run(); // 执行
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

完整 html 代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ffmpeg播放视频</title>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  </head>

  <body>
    <div>
      <video controls="controls" id="video"></video>
      <script>
        var video = document.getElementById("video");
        var videoSrc = "http://localhost:3030/static/ForeverAi.m3u8";
        if (Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(video);
        }
      </script>
    </div>
  </body>
</html>
```
