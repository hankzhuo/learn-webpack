# Webpack 基本用法

1. 设置 entry，设置单入口、多入口配置
2. 设置 output，多入口配置，[name] 占位符
3. 设置 loader，webpack 自带的只支持 JS 和 JSON 两种文件类型，其他文件类型则通过配置 loaders，比如 `babel-loader、css-loader、less-loader、ts-loader、file-loader、thread-loader` 等。`url-loader` 也可以处理图片和字体，可以设置较小资源自动 base64
4. 设置 plugins，插件用于 bundle 文件的优化（删除目录、压缩、提取 CSS等）
5. 设置 mode，指定当前构建环境：`production`、`development`、`none`。默认是 `production`，可以设置 `process.env.NODE_ENV` 的值
6. 设置 babel，解析 ES6、解析 react，使用 `babel-loader`、配置 .babelrc 文件
7. 设置文件监听
   1. webpack 开启监听模式，有两种方式：
      1. 启动 webpack 命令时，带上 --watch 参数
      2. 在配置 `webpack.config.js` 设置 watch: true
   2. 缺陷就是，浏览器不能自动刷新
   3. 原理分析：轮询判断文件的最后编辑时间是否变化，某文件发生了变化，并不会立即告诉监听者，而是先缓存起来，等待一段时间 aggregateTimeout，如果这段时间有其他文件发生了变化，则下次一起更
8. 设置热更新
   1. 两种方式热更新：
      1. `webpack-dev-server`：不输出文件，而是放在内存中
      2. 使用 `webpack-dev-middleware`：使用 node 中间件输出
9. `Hash`
   1. `Hash`：每次项目构建，只要项目中有文件有修改，整个项目文件的 hash 值都会变化
   2. `Chunkhash`：和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 `chunkhash` 值（一般设置 JS 文件）
   3. `Contenthash`：根据文件内容来定义 hash，只要内容不变，`contenthash` 不变（一般设置 CSS 文件）
10. 设置压缩
    1.  `HTML、CSS、JS` 压缩
    2.  生产环境下，js 代码默认会压缩
11. 自动清空构建目录 dist
    1.  使用 `clean-webpack-plugin` 插件
12. PostCSS、autoprefix 插件
    1.  自动补充 CSS3 前缀，使用 `postcss-loader` 、`autoprefixer`
13. 移动端 px 转换成 rem
    1.  使用 `px2rem-loader` 转换、`flexible` 库设置 html 的根节点的 `font-size`
14. 静态资源内联
    1.  减少 url 请求次数，小图片或字体内联（url-loader）
    2.  HTML 和 JS 内联，可以使用 raw-loader
    3.  CSS 内联：
        1.  第一种是 借助 style-loader，设置参数 options
        2.  使用 html-inline-css-webpack-plugin 插件
15. 多页面打包方案
    1.  每个页面对应一个 entry 和设置 html-webpack-plugin 插件
    2.  使用 glob 库，动态获取每个入口的路径
16. 使用 sourcemap
    1.  开发环境开启，定位到源代码
    2.  线上环境，一般不开启，会暴露源码
17. 提取公共资源
    1.  将 react、react-dom 基础包通过 cdn 方式引入，不打入 bundle 中，可以使用 `html-webpack-externals-plugin` 插件
    2.  使用 webpack4 内部 SplitChunksPlugin 插件，也可以提取公共文件
    3.  预编译资源模块，使用 DLLPlugin 插件进行分包，使用 `DllReferencePlugin` 插件对 `manifest.json` 引用，然后在模板文件中引入
18. JavaScript 使用 Tree Shaking 
    1.  一些不会执行的代码不会打包进文件，production 模式下自动执行
19. Scope Hoisting
    1.  production 模式下默认开启(webpack 4)，减少闭包
20. 代码分割、动态 import 
    1.  抽离相同代码到一个公共块
    2.  脚本懒加载，使得初始下载的代码更小
    3.  不是首屏的内容可以先不加载
    4.  require.ensure
    5.  动态 import (需要 babel 插件 `babel/plugin-syntax-dynamic-import`）
21. ESLint 规范
    1.  使用 `eslint-config-airbnb、eslint-config-airbnb-base` 插件
    2.  本地开发阶段增加 precommit 钩子
    3.  增加到 webpack 中，比如 `eslint-loader`
22. SSR
    1.  服务端核心是减少请求，提高首屏渲染速度。
    2.  主要用到了 react 的 API `renderToString`，将 React 组件转化为字符串形式，起一个 node 服务，将模板返回给浏览器
    3.  解决问题：
        1.  样式不显示问题
        2.  浏览器全局变量问题
        3.  获取数据问题
23. 构建显示日志
    1.  自带 stats
    2.  friendly-errors-webpack-plugin 插件

# webpack 打包优化

1. 使用 `speed-measure-webpack-plugin` 分析每个 loader 和插件执行耗时
2. 使用 `webpack-bundle-analyzer` 插件分析打包体积，构建完成后打开端口 8888 展示
3. 使用高版本的 `webpack` 和 `node`，软件自身做了很多优化
4. 多进程打包，可以使用 thread-loader（webpack4 自带）、HappyPack（不再维护）、parallel-webpack
5. 多进程并行压缩 `uglifyjs-webpack-plugin`、`terser-webpack-plugin（webpack4 推荐）` 开启参数 `parallel: true`
6. 分包
   1. 设置 Externals，使用 `html-webpack-externals-plugin` 公共库 React、React-DOM 等包抽离出来，不打包进 bundle，采用 CDN 方式引入。缺点就是要引入多个 script 标签
   2. 预编译资源模块，使用 DLLPlugin 插件进行分包，使用 `DllReferencePlugin` 插件对 `manifest.json` 引用，然后在模板文件中引入
7. 缓存
   1. 使用 babel-loader 开启缓存
   2. 使用 terser-webpack-plugin 开启缓存
   3. 使用 cache-loader 或者 hard-source-webpack-plugin
8. 减少构建目标
   1. 比如 babel-loader 不解析node_modules
   2. 减少文件的搜索范围，优化 resolve.modules、resolve.extensions、resolve.mainFields 配置，合理使用 alias
9. 使用 Tree Shaking 去除无用的 JavaScript 和 CSS
   1.  JavaScript 代码在 production 模式下自动执行
   2.  CSS 使用 `purgecss-webpack-plugin` 和 `mini-css-extract-plugin` 插件
10. 使用 webpack 进行图片压缩，使用 `image-webpack-plugin` 插件
11. 使用动态 polyfill，`polyfill-service` 可以识别每个手机的 User Agent 对支持程度代码支持程度，动态加载下发 polyfill
