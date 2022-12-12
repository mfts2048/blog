---
title: "github-actions使用pnpm自动部署和发包"
update_time: "2022-07-10"
keyword: "github,actions,pnpm,发包,部署,自动化"
---

## 参考地址

> https://github.com/pnpm/action-setup

> https://www.pnpm.cn/npmrc#url_authtoken

> https://www.jianshu.com/p/40f732d91a8c/

> https://blog.csdn.net/qq_38280242/article/details/104642616

> https://github.com/quassum/SVG-to-SwiftUI/blob/1cc440e273/.github/workflows/npm-publish.yml

1. 使用 pnpm 的时候要具体到版本号

    ```yml
    - uses: pnpm/action-setup@v2.0.1
        name: Install pnpm
        id: pnpm-install
        with:
          version: 7
    ```

2. 使用 pnpm 的时候好像会更改 npm 的源，所以你需要设置一下源，和 token

    ```yml
    - name: Setup npmrc
        run: echo "//registry.npmjs.org/:_authToken=${{ secrets.npm_token }}" > .npmrc
    ```
3. 发包的时候会校验git，我使用的是

    ```yml
    - name: pnpm publish
        run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{secrets.npm_token}}
    ```
## 可以正常使用的自动部署和自动发包
```yml
# This workflow will run tests using node and then publish a package to GitHub Packages when a release is created
# For more information see: https://help.github.com/actions/language-and-framework-guides/publishing-nodejs-packages

name: Node.js Package

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - uses: pnpm/action-setup@v2.0.1
        name: Install pnpm
        id: pnpm-install
        with:
          version: 7

      - name: Install dependencies
        run: pnpm install

      - name: pnpm run test
        run: pnpm run test

  publish-npm:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - uses: pnpm/action-setup@v2.0.1
        name: Install pnpm
        id: pnpm-install
        with:
          version: 7

      - name: Setup npmrc
        run: echo "//registry.npmjs.org/:_authToken=${{ secrets.npm_token }}" > .npmrc

      - name: Install dependencies
        run: pnpm install

      - name: pnpm publish
        run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{secrets.npm_token}}
```