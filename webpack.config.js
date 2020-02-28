let path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: path.resolve(__dirname, "./src/index.ts"),
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "index.js",
    libraryTarget: 'umd'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  devServer: {
    contentBase: path.join(__dirname, "./"),
    compress: true,
    port: 9001,
    host: '127.0.0.1',
    proxy: {
      '/common_selector': {
        target: 'http://ux.lezhixing.com.cn',
        // target: 'http://10.4.88.130:8080',
        changeOrigin: true,
        // headers: {
        //   Cookie: 'AQ_VID=afd5e785bb1d4a609734b0f950bcb0a1; DWRSESSIONID=EcsVZN2Nt27znXxU72o0rqkbSYgann2ea!m; AQ_GROUPID_COOKIE_KEY=ece9781eff0b4e2eb1c7da49c6d7bf57; AQ_ECSPLATFORMID_COOKIE_KEY=c7226c6a882849ff91a6a729682d1111; JSESSIONID=68080697CC17BDD4CE943F2C2E3B717B; AQ_AUTHENTICATION_COOKIE_KEY=1500000200047118172; AQ_AUTHENTICATION_COOKIE_KEY_SIGN=4401bf9f65e4b7f8c28e60356797e71e64ed3ffe7452c3c383fd5f9b6d2009044abf51754bd1bff951621deb9c457dd541e3a4977d2fea6cad4e5fe28f6be089133ca12cac63d816; AQ_AUTHENTICATION_UID_COOKIE_KEY=4401bf9f65e4b7f8901f1a19fb9fc67972c542175fdc7767f0a4d02dc0a3a51467a361b8ea330b790d1d137c004d81518a7370adec9bb274; USER_OPERATER_COOKIE_KEY=1578572177954'
        // }
        pathRewrite: {
          '^/common_selector': '/mock/247/common_selector'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              [
                '@babel/preset-env',
                {
                  "useBuiltIns": "usage",
                  "corejs": '3.3'
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.css/,
        oneOf: [{
          resourceQuery: /^\?raw$/,
          use: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
            require.resolve('postcss-loader')
          ]
        }, {
          use: [
            {
              loader: 'style-loader'
            }, 
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local',
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                  context: path.resolve(__dirname, 'src'),
                  hashPrefix: 'my-custom-hash',
                }
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        }]
      },
      {
        test: /\.(png|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, "./index.html")
    })
  ]
}