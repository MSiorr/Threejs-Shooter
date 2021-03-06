var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    sourceMapFilename: "bundle.js.map"
  },
  devtool: "source-map",
  mode: 'development', // none, development, production
  devServer: {
    port: 8080
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: './index.html', //relative to root of the application
      template: './src/index.html',
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'images/[hash]-[name].[ext]'
          }
        }]
      },
      {
        test: /.(md2)$/i,
        type: 'asset/resource',
     }
    ]
  },
};