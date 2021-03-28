import {instance1} from './instance.js'

export function setLoginData(a) {
   return instance1({
      url: 'login',
      method: 'post',
      data: {
         username: a.name,
         password: a.password,
      }
   })
}