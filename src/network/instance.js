import axios from 'axios';
// 导入nprogress包相应的js css
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

export function instance1(config){
    const instance = axios.create({
        baseURL : ' http://www.ysqorz.top:8888/api/private/v1/',
         /*         https://www.liulongbin.top:8888/api/private/v1/*/           

        timeout:5000,
         /*  withCredentials:true, */ 
        });
    
instance.interceptors.request.use(function(a){ 
        a.headers.Authorization = window.sessionStorage.getItem('token') 
        nprogress.start()   // 成功请求时 开启进度条动画
        return a ;},function(err){console.log(err)}),

instance.interceptors.response.use(function(res){console.log(res);
        nprogress.done()    // 响应成功时 关闭进度条动画
         return res;},function(err){console.log(err /* +'11111' */);})

    return instance(config)
}
 