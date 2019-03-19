const { WebpackWarPlugin } = require('webpack-war-plugin')

module.exports = {
  publicPath: '/dt-trasferte/',
  css: {
    // Enable CSS source maps.
    sourceMap: true
  },
  pwa: {
    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      // swSrc: 'public/service-worker.js',
      // ...other Workbox options...
    }
  },
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      // mutate for production...
      return {
        plugins: [
          new WebpackWarPlugin({
            archiveName: 'dt-trasferte',
          })
        ],
        devServer: {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        },
        resolve: {
          alias: require('./aliases.config').webpack
        }   
      }
    } else {
      // mutate for development...
      return {
        devServer: {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        },
        resolve: {
          alias: require('./aliases.config').webpack
        }
      }
    }
  }
}