---
outline: deep
---
# 搭建一个vue3项目
## 一、初步搭建 
### 1. 初始化项目
* 创建一个文件夹`vue3_webpack`，并初始化
```bash
npm init -y
```
### 2. 创建基本目录和文件
```bash
mkdir -p src public
touch src/main.js src/App.vue index.html
```
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>vue3_webpack</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```
```js
// src/main.js
import { createApp } from "vue"
import App from "./App.vue"

const app = createApp(App)

app.mount('#app')
```
```vue
<!-- src/App.vue -->
<template>
  <div>
    <h1>webpack+vue3</h1>
    <p>{{ count }}</p>
    <p>{{ dubCount }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 为了验证Babel是否能正确编译箭头函数
const count = ref(2)
const dubCount = computed(() => count.value * 2)
</script>

<style scoped></style>
```
### 3. 安装Webpack及相关依赖
```bash
npm install webpack webpack-cli webpack-dev-server html-webpack-plugin css-loader style-loader clean-webpack-plugin -D 
```
* webpack: 打包工具
* webpack-cli: Webpack的命令行工具
* webpack-dev-server: 开发服务器
* html-webpack-plugin: 用于生成`HTML`文件
* css-loader、style-loader: 处理`CSS`文件
* clean-webpack-plugin：构建时清理旧文件

### 4. 安装Vue及相关依赖
```bash
npm install vue@next
npm install vue-loader@next vue-style-loader -D
npm install @vue/compiler-sfc -D

```
* vue@next：Vue3核心库
* vue-loader@next：解析`.vue`组件
* vue-style-loader：处理样式
* @vue/compiler-sfc：解析单文件组件（SFC）

### 5. 安装Babel依赖
```bash
npm install @babel/core @babel/preset-env babel-loader -D
```
* @babel/core：Babel的核心库
* @babel/preset-env：智能转换现代JS代码，使其兼容旧浏览器
* babel-loader：让Webpack处理JS代码时使用Babel进行转换

### 6. 配置webpack
```js
// 根目录新建 webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    open: true,
    hot:true,
    port: 9000,
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            "exclude": [
              /node_modules[\\\/]core-js/,
              /node_modules[\\\/]webpack[\\\/]buildin/,
            ],
          },
        },
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'vue-style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    }),
  ],
};

```
### 7. 配置Babel
```json
// 根目录新建 .babelrc
{
  "presets": [
    "@babel/preset-env"
  ]
}
```
### 8. 修改package.json
```json
// package.json
"scripts": {
  "dev": "webpack serve --open",
  "build": "webpack"
}
```
### 9. 运行项目
* 开发模式
```bash
npm run dev
```
会启动 webpack-dev-server，并自动打开浏览器，页面显示`webpack+vue3`和数字`2`，`4`
* 生产模式
```bash
npm run build
```
会在dist目录生成最终打包的文件

## 二、区分环境
### 1. 安装webpack-merge
```bash
npm install webpack-merge -D
```
* webpack-merge用于合并Webpack配置

### 2. 创建Webpack配置文件
#### 2.1 公共配置：webpack.common.js
```js
// 根目录新建 webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: './',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            "exclude": [
              /node_modules[\\\/]core-js/,
              /node_modules[\\\/]webpack[\\\/]buildin/,
            ],
          },
        },
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'vue-style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    }),
  ],
};
```
#### 2.2  开发环境配置：webpack.dev.js
```js
// 根目录新建 webpack.dev.js
const path = require('path');
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
    hot: true,
    compress: true,
    port: 9000,
  },
})
```
#### 2.3 生产环境配置：webpack.prod.js
```js
// 根目录新建 webpack.prod.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [new CleanWebpackPlugin()]
})
```
至此成功使用webpack手动搭建了一个Vue3项目，并且通过Babel兼容旧浏览器🚀