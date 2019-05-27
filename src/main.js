// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import qs from 'qs'
import { AjaxPlugin, WechatPlugin, AlertModule, base64 ,DatetimePlugin } from 'vux'
import App from './App'
import router from './router'
import store from './vuex/store'
import 'lib-flexible' // 自适应
// import polyfill from 'polyfill'

// import './styles/common.less'

Vue.use(VueRouter)
Vue.use(Vuex)

// 兼容低版本浏览器
require('es6-promise').polyfill()

// mockjs
//require('./mock/mock')

// 微信
Vue.use(WechatPlugin)
// axios
Vue.use(AjaxPlugin)

FastClick.attach(document.body)

Vue.config.productionTip = false

// 配置微信
Vue.use(DatetimePlugin)
// 热加载
if (module.hot) {
  module.hot.accept()
}
if (process.env.NODE_ENV === 'production') {
  // 生产环境
//Vue.prototype.$http.defaults.baseURL = 'http://dsh.nat200.top/scrmwx/'
	Vue.prototype.$http.defaults.baseURL = 'http://dk.qipai.com.cn/scrmwx/'
  Vue.prototype.$http.defaults.method = 'post'
  Vue.prototype.$http.defaults.timeout = 15000
//Vue.prototype.$http.defaults.responseType = 'json'
}
if (process.env.NODE_ENV === 'development') {
  // 测试环境
 	Vue.prototype.$http.defaults.baseURL = 'wx/' // http://dsh.nat200.top/scrmwx/ 跨域请求
 	Vue.prototype.$http.defaults.method = 'post'
  Vue.prototype.$http.defaults.timeout = 15000
// Vue.prototype.$http.defaults.responseType = 'json'
}
// 添加请求拦截器
Vue.prototype.$http.interceptors.request.use(function (config) {
  // console.log(config, config.data)
  // 在发送请求之前做些什么
	if(config.data){
		let configData = JSON.parse(JSON.stringify(config.data))
		config.data = configData
	}
  // base64加密
  let configStr = JSON.stringify(config.data)
  config.data = base64.encode(configStr)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
Vue.prototype.$http.interceptors.response.use(function (response) {
  // 对响应数据做点什么
	// 返回值base64解密
	
  let params = {
    data: ''
  }
//console.log(JSON.stringify(response)+"111")
  if(response.data){
  	params.data = JSON.parse(base64.decode(response.data))
  	let data = params.data
  	let code = data.returnCode
		let msg = data.returnMsg
		console.log(data)
  	// 当错误码为-1时的回调
  	if (code === '-1') {
  	  AlertModule.show({
  	    title: '错误',
  	    content: msg,
  	    onShow () {
  	      // 显示弹窗回调
  	    },
  	    onHide () {
  	      // 关闭弹窗回调
  	    }
  	  })
  	  // 三秒定时关闭弹窗
  	  setTimeout(() => {
  	    AlertModule.hide()
  	  }, 3000)
  	}
  	return params
  }else{
  	AlertModule.show({
  	    title: '错误',
  	    content: '系统错误',
  	    onShow () {
  	      // 显示弹窗回调
  	    },
  	    onHide () {
  	      // 关闭弹窗回调
  	    }
  	  })
  	return ''
  }
}, function (error) {
  console.log(error);
	let originalRequest = error.config;
	if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1 && !originalRequest._retry){
  	AlertModule.show({
  	    title: '错误',
  	    content: '服务器请求超时',
  	    onShow () {
  	      // 显示弹窗回调
  	    },
  	    onHide () {
  	      // 关闭弹窗回调
  	    }
  	  })
	  // 三秒定时关闭弹窗
	  setTimeout(() => {
	    AlertModule.hide()
	  }, 3000)
	}
  // 对响应错误做点什么
  if (error.response) {
    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
//  console.log(error.response.data, 'error.response.data')
//  console.log(error.response.status, 'error.response.status')
//  console.log(error.response.headers, 'error.response.headerssdsd')
    let message='';
		switch(error.response.status) {
			case 401:
				message='未授权，请重新登录';
				break

			case 403:
				message='拒绝访问';
				break

			case 404:
				message='请求地址出错';
				break

			case 408:
				message='请求超时';
				break

			case 500:
				message='服务器内部错误';
				break

			case 501:
				message='服务未实现';
				break

			case 502:
				message='网关错误';
				break

			case 503:
				message='服务不可用';
				break
			case 504:
				message='网关超时';
				break

			case 505:
				message='HTTP版本不受支持';
				break
			default:
	    	return status;
		}
		AlertModule.show({
	    title: '错误',
	    content: message,
	    onShow () {
	      // 显示弹窗回调
	    },
	    onHide () {
	      // 关闭弹窗回调
	    }
	  })
	  // 三秒定时关闭弹窗
	  setTimeout(() => {
	    AlertModule.hide()
	  }, 3000)
  } else {
    console.log('Error', error.message)
  }
  return Promise.reject(error)
})

// 公共函数
Vue.prototype.$method = function () {}

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
