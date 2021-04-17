import {instance1} from './instance.js'

export function aSetLoginData(a) {
   return instance1({
      url: 'login',
      method: 'post',
      data:a,
      /* data: {
         username: a.name,
         password: a.password,
      } */
   })
}