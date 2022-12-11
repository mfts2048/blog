---
title: "angular request.service.ts"
update_time: "2022-05-27"
---

> https://blog.csdn.net/zarek_jiamu/article/details/115423074

```typescript
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})

/**
 * @date 2019-04-01
 * @description http请求客户端服务
 */
export default class HttpServe {
  constructor(private http: HttpClient) {}

  /**
   * 处理数据请求
   * @param result 数据请求返回数据
   * @param success 成功数据回调
   * @param fail 失败数据请求
   */
  private formatData(result: any, success: any, fail: any) {
    const { status, message, datas } = result;
    if (status === 200) {
      success && success(datas);
      return;
    }
    fail && fail(false);
    console.log(message || "服务异常，请联系管理员");
  }

  /**
   * 配置数据请求头部
   * @param type 后端数据接受格式
   * @param param get请求数据
   */
  private setHttpInfo(type: number = 0, param: any = null): any {
    // 数据上送格式类型
    const contentType = [
      "application/json;charset=UTF-8",
      "multipart/form-data",
    ];
    // 获取本地token
    const token = localStorage.getItem("token");
    return {
      param,
      headers: new HttpHeaders({
        "Content-Type": contentType[type],
        Authorization: token || "",
      }),
    };
  }

  /**
   * Post数据请求
   * @param data 请求数据
   * @param url 请求数据地址
   * @param success 请求成功回调函数
   * @param fail 失败数据回调函数
   */
  post(url: string, data: any, success: any = null, fail: any = null): void {
    this.http
      .post<any>(url, data, this.setHttpInfo())
      .subscribe((data: any) => this.formatData(data, success, fail));
  }

  /**
   * 上传文件
   * @param {FormData} data 请求数据
   * @param url 请求数据地址
   * @param success 请求成功回调函数
   * @param fail 失败数据回调函数
   */
  file(
    url: string,
    data: FormData,
    success: any = null,
    fail: any = null
  ): void {
    this.http
      .post<any>(url, data, this.setHttpInfo(1))
      .subscribe((data: any) => this.formatData(data, success, fail));
  }

  /**
   * patch数据请求
   * @param data 请求数据
   * @param url 请求数据地址
   * @param success 请求成功回调函数
   * @param fail 失败数据回调函数
   */
  patch(url: string, data: any, success: any = null, fail: any = null): void {
    this.http
      .patch<any>(url, data, this.setHttpInfo())
      .subscribe((data: any) => this.formatData(data, success, fail));
  }

  /**
   * delete数据请求
   * @param data 请求数据
   * @param url 请求数据地址
   * @param success 请求成功回调函数
   * @param fail 失败数据回调函数
   */
  delete(
    url: string,
    data: any = null,
    success: any = null,
    fail: any = null
  ): void {
    this.http
      .delete<any>(url, this.setHttpInfo(0, data))
      .subscribe((data: any) => this.formatData(data, success, fail));
  }

  /**
   * get数据请求
   * @param url 请求数据地址
   * @param param 请求参数
   * @param success 成功回调
   * @param fail 失败回调
   */
  get(url: string, param: any, success: any = null, fail: any = null): void {
    this.http
      .get(url, this.setHttpInfo(0, param))
      .subscribe((data: any) => this.formatData(data, success, fail));
  }

  /**
   * @method Promise数据请求
   * @param url 数据请求地址
   * @param data 请求参数
   * @param method 请求方法 get、 post、 patch、 delete
   */
  async promise(url: string, data: any = null, method = "get"): Promise<any> {
    switch (method) {
      case "post":
        return await new Promise((resolve) =>
          this.post(url, data, resolve, resolve)
        );
      case "get":
        return await new Promise((resolve) =>
          this.get(url, data, resolve, resolve)
        );
      case "delete":
        return await new Promise((resolve) =>
          this.delete(url, data, resolve, resolve)
        );
      case "patch":
        return await new Promise((resolve) =>
          this.patch(url, data, resolve, resolve)
        );
    }
  }

  /**
   * promiseAll 数据请求
   * @param list 请求配置数据类型为{method:get||post||delete||file||patch,data:any,url:string}
   */
  async promiseAll(list: any = []) {
    if (list.length < 2) {
      console.log("数据请求配置数组长度应大于1");
      return false;
    }
    const sendList: any = [];
    list.map((item: any) =>
      sendList.push(
        this.promise(item.url, item.data || null, item.method || "get")
      )
    );
    return await Promise.all(sendList);
  }
}
```
