const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
const registerRouter = require('./backend/router')

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  devServer: {
    before(app) {
      registerRouter(app)
    }
  },
  // npm run build --report来调用webpack-bundle-analyzer插件
  // 实际上执行npm run build --report时，在process.env对象内添加了一个属性
  configureWebpack: (config) => {
    if(process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },
  productionSourceMap: false
}