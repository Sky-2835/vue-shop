import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'assets/fonts/iconfont.css';
import axios from 'axios'
// 导入nprogress包相应的js css
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入自己封装的面包屑导航
import Breadcrumb from './components/content/Breadcrumb.vue'



axios.defaults.baseURL='http://www.ysqorz.top:8888/api/private/v1/'
axios.defaults.timeout=5000
axios.interceptors.request.use(config=>{
        nprogress.start()  // 成功请求时 开启进度条动画
        config.headers.Authorization = window.sessionStorage.getItem('token')   
        return config 
},err=>{})

axios.interceptors.response.use(res=>{
        nprogress.done()   // 响应成功时 关闭进度条动画
        console.log(res);
        return res
},err=>{})

Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.component('bc', Breadcrumb)



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

