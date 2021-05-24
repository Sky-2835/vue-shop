import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'assets/fonts/iconfont.css';
import axios from 'axios'
// 导入nprogress包相应的js css (不用注册 直接使用)
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入富文本编辑器 以及它的css文件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 注册成为全局组件 (注意是与Element ui一样 使用 .use注册   而不是Vue.component('',xx))
Vue.use(VueQuillEditor, /* { default global options } */)

// 导入自己封装的面包屑导航组件
import Breadcrumb from './components/content/Breadcrumb.vue'

// 导入vue-table-with-tree-grid组件
import tableTree from 'vue-table-with-tree-grid'

// 自己给Vue原型对象 定义添加一个全局变量 基础地址 ； 所有组件 可用: this.$baseUrl 
const _baseURL ='http://www.ysqorz.top:8888/api/private/v1/'
Vue.prototype.$baseURL = _baseURL


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
Vue.component('table-Tree', tableTree)

// 设置全局过滤器 
Vue.filter('dateFormat',(item)=>{

   const d = new Date(item)
   var y = d.getFullYear()   
   var m = (d.getMonth() + 1 + '').padStart(2,'0')
   var r = (d.getDate() + '').padStart(2,'0')
   var h = (d.getHours() + '').padStart(2,'0')
   var mm = (d.getMinutes() + '').padStart(2,'0')
   var s = (d.getSeconds() + '').padStart(2,'0')

   return `${y}-${m}-${r} ${h}:${mm}:${s}`
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

