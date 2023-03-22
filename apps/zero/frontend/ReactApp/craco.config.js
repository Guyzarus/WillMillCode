
module.exports = {

  webpack: {

    configure: (webpackConfig, { env, paths }) => {

      webpackConfig.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack','url-loader'],
      })

      webpackConfig.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            ignore: [ './node_modules/mapbox-gl/dist/mapbox-gl.js' ]
          }
        }
      })



      return webpackConfig;
    },
  },
};
