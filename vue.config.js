'use strict'
module.exports = {
  productionSourceMap: false,
  chainWebpack(config) {
    config.plugins.delete('prefetch') 
  },
  publicPath: "./"
}