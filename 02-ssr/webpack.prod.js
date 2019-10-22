const webpack = require('webpack');
const glob = require('glob'); // 异步获取文件路径
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 把 css 提取出来，再加上 hash 值
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // CSS 压缩插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // HTML 模板，多文件模板
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清除输出文件的目录
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');  // 公共库抽离出来，不打包进 bundle
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// 多页面设置入口
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));

  Object.keys(entryFiles)
      .map((index) => {
          const entryFile = entryFiles[index];
          const match = entryFile.match(/src\/(.*)\/index\.js/);
          const pageName = match && match[1];
          entry[pageName] = entryFile; // pageName: index、search
          htmlWebpackPlugins.push(
              new HtmlWebpackPlugin({
                  inlineSource: '.css$',
                  template: path.join(__dirname, `src/${pageName}/index.html`),
                  filename: `${pageName}.html`,
                  chunks: ['vendor', 'commons', pageName],
                  inject: true,
                  minify: {
                      html5: true,
                      collapseWhitespace: true,
                      preserveLineBreaks: false,
                      minifyCSS: true,
                      minifyJS: true,
                      removeComments: false
                  }
              })
          );
      });

  return {
      entry,
      htmlWebpackPlugins
  }
}
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
                plugins: () => [
                    require('autoprefixer')({
                      overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                    })
                ]
            }
        },
        {
          loader: 'px2rem-loader',
          options: {
              remUnit: 75,
              remPrecision: 8
          }
        }
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
          global: 'ReactDOM',
        },
      ]
  }),
  new FriendlyErrorsWebpackPlugin(),
  function() {
      this.hooks.done.tap('done', (stats) => {
          if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1)
          {
              console.log('build error');
              process.exit(1);
          }
      })
  }
  ].concat(htmlWebpackPlugins),
  optimization: {
      splitChunks: {
          minSize: 0,
          cacheGroups: {
              commons: {
                  name: 'commons',
                  chunks: 'all',
                  minChunks: 2
              }
          }
      }
  },
  stats: 'errors-only'
}