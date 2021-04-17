import {instance1} from './instance.js'

// created 请求用户列表数据
export function aGetUsersList(a){
    return instance1({
        method:'get',
        url:'users',
        params:a,
    })
}

// switch按钮 用户状态改变
export function aUserStatechange(a) {
  return  instance1({
      method:'put',
      /* url:'users/:uid/state/:type' */
      url:`users/${a.id}/state/${a.mg_state}`    // ``${} 注释见 users.vue 113行  
  })
}


// 确定按钮 添加新用户 
export function aSetNewUsers(a) {
    return instance1({
        method:'post',
        url:'users',
        data:a
    })
}

// 编辑用户信息    a为传入的用户id
export function aEditUsers(a) {
    return instance1({
        method:'get',
        url:'users/' + a   // `users/${a}`
    })
}

// 确定按钮 修改用户信息 
export function aSetEditUsers(a) {
    return instance1({
        method:'put',
        url:`users/${a.id}`,
        data:{
            email:a.email,
            mobile:a.mobile,
        }
    })
}

// 确定按钮 删除用户 a为传入的用户id
export function aDeleteUser(a) {
  return instance1({
      method:'delete',
      url:`users/${a}`,
  })   
}