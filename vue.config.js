// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  /* publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/vue-d-media/', */
  outputDir: isProd ? path.join(__dirname, 'dist') : path.join(__dirname, 'demo'),
  pages: isProd ? {} : undefined,
  css: {
    extract: false
  },
  configureWebpack: (config) => {
    // config.resolve.extensions.push('.d.ts')
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias['~types'] = path.join(__dirname, 'types')
    if (isProd) {
      config.plugins.some((plugin, index) => ((plugin.options || {}).filename === 'demo.html' ? config.plugins.splice(index, 1) : false))
    }
  },
  chainWebpack: (config) => {
    // config.module.rule('vue').use('ts-loader').tap((options) => ({ ...options, appendTsSuffixTo: [/\.vue$/] }))
    // config.module.rule('vue').use('ts-loader').loader('ts-loader').options({ appendTsSuffixTo: [/\.vue$/] })
    if (isProd) {
      config.module.rule('svg').uses.clear()
      config.module.rule('images').use('url-loader')
        .tap((options) => ({ ...options, limit: 1000000 }))
      config.module.rule('svg')
        .use('url-loader')
        .loader('url-loader')
        .tap((options) => ({ ...options, limit: 1000000 }))
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://d-media-bundle-example.local',
        // pathRewrite: { '^/api': '/api/board' },
        secure: false,
        changeOrigin: true
      },
      '/storage': {
        target: 'http://d-media-bundle-example.local',
        secure: false,
        changeOrigin: true
      }
    }
  }
}
