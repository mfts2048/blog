---
title: "canvas.toDataURL 无法正常执行"
update_time: "2022-09-13"
keyword: "canvas,toDataURL,跨域"
error: "Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported."
---

:::tip
参考 https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#security_and_tainted_canvases
:::

在绘制的过程中，使用到的 <img /> 图像源不符合同源规则，所以需要开发者手动的设置图片的 `crossorigin` 属性，来告诉浏览器在尝试下载图像数据时请求跨域访问。

```javascript
function startDownload() {
  let imageURL = "https://cdn.glitch.com/4c9ebeb9-8b9a-4adc-ad0a-238d9ae00bb5%2Fmdn_logo-only_color.svg?1535749917189";

  downloadedImg = new Image();
  downloadedImg.crossOrigin = "Anonymous";
  downloadedImg.addEventListener("load", imageReceived, false);
  downloadedImg.src = imageURL;
}

function imageReceived() {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  canvas.width = downloadedImg.width;
  canvas.height = downloadedImg.height;

  context.drawImage(downloadedImg, 0, 0);
  imageBox.appendChild(canvas);
    
  try {
    canvas.toDataURL("image/png");
  }
  catch(err) {
    console.log("Error: " + err);
  }
}
```
