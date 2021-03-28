import axios from 'axios';

export function instance1(config){
    const instance = axios.create({
        baseURL : 'https://www.liulongbin.top:8888/api/private/v1/',
        timeout:5000,
       /*  withCredentials:true, */ 
    });
    
    instance.interceptors.request.use(function(a){console.log(a) ;  return a ;},function(err){console.log(err)}),

    instance.interceptors.response.use(function(res){console.log(res) ; return res;},function(err){console.log(err /* +'11111' */);})

    return instance(config)
}
