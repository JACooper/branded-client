var path = require('path');

const config = {
  entry: {
    wpentry: './js/wpentry.js'
  },
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname + '/../server-src/client/js')
  },
  // loader preset taken from: https://medium.freecodecamp.com/tree-shaking-es6-modules-in-webpack-2-1add6672f31b#.eaao9x1od
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, 'js'),
        loader: 'babel-loader',
        options: { 
          presets: [ 
            // Setting modules to false means babel-loader won't run on es2015 modules (webpack 2 can handle these)
            [ 'es2015', { modules: false } ]
          ] 
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  }
};

module.exports = config;