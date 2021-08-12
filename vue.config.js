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
  }
}