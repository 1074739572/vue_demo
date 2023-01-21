const { defineConfig } = require('@vue/cli-service')

let proxyObj={}
proxyObj['/']={
  //websocket
  ws:false,
  //目标地址
  target:'http://localhost:8081',
  //发送请求host会被设置成target
  changeOrigin:true,
  pathReWrite:{
    '^/':'/'
  }
}
module.exports = defineConfig({
  devServer:{
    host:'localhost',
    port:8080,
    proxy:proxyObj
  },
  transpileDependencies: true
})
