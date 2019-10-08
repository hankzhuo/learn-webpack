# Webpack 用法

## 1. entry

单入口、多入口配置

## 2. output

多入口配置，[name] 占位符

## 3. loader

webpack 自带的只支持 JS 和 JSON 两种文件类型，其他文件类型则通过配置 loaders，比如 babel-loader、css-loader、less-loader、ts-loader、file-loader、thread-loader 等

url-loader 也可以处理图片和字体，可以设置较小资源自动 base64

## 4. plugins

插件用于 bundle 文件的优化（删除目录、压缩、提取 CSS等）

## 5. mode

指定当前构建环境：production、development、none。默认是 production

可以设置 process.env.NODE_ENV 的值

## 6. babel

解析 ES6、解析 react

使用 babel-loader、配置 .babelrc 文件

## 7. 文件监听

webpack 开启监听模式，有两种方式：
- 启动 webpack 命令时，带上 --watch 参数
- 在配置 webpack.config.js 设置 watch: true

缺陷就是，浏览器不能自动刷新

原理分析：
轮询判断文件的最后编辑时间是否变化，某文件发生了变化，并不会立即告诉监听者，而是先缓存起来，等待一段时间 aggregateTimeout，如果这段时间有其他文件发生了变化，则下次一起更新。 

```js
module.export = {
  // 默认是 false，也就是不开启
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300, // 监听到变化后会等待 300ms 再去执行，默认 300ms
    poll: 1000 // 判断文件是否发生变化，是通过轮询的方式去询问，默认每秒问 1000 次
  }
}
```

## 8. 热更新

