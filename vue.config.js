// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/vue-d-media/',
  outputDir: process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'lib')
    : path.join(__dirname, 'demo'),
  css: {
    extract: false
  },
  chainWebpack: (config) => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end()
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://d-media-bundle-example.local',
        pathRewrite: { '^/api': '/api/board' },
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
