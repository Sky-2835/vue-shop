import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [         
  {
    path:'',
    redirect:'/login',  
  },

  {
    path:'/login',
    component: () => import ('../components/login.vue')
  },

  {
    path:'/home',
    component:() => import ('../components/home/home.vue'),
    children:[
      {
        path:'',
        redirect:'welcome'
      },
      {
        path:'welcome',
        component: () => import ('../components/home/welcome.vue'),
      },
      {
        path:'/users',
        component: () => import('../components/home/users.vue')
      },
      {
        path:'/reports',
        component: () => import ('../components/report/report.vue')
      },
      {
        path:'/rights',
        component: () => import('../components/power/rights.vue')
      },
      {
        path:'/roles',
        component:()=> import('components/power/roles.vue')
      },
      {
        path:'/categories',
        component: ()=> import('../components/goods/cate.vue')
      },
    ]

    /* beforeEnter(to,from,next){
      if(!window.sessionStorage.getItem('token')){  //设置没有登录口令，直接访问这个接口页面，跳转到登录页面
        next('/login')  // 也可以写成 next({path:'/login'})
      }else{next()}
    } */
 },
  {
    path:'/helloWorld',
    component: () => import ('../components/HelloWorld.vue')
  },
]

const router = new VueRouter({
  mode: 'history'/* 'hash' */,
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{          // 当路径为login时执行下一步，没有token时，返回登录界面，登录了继续不影响
  if(to.path === '/login') return next();
  if(!window.sessionStorage.getItem('token')){
    return next('/login')                    // next({path:'/login'})
  }
  next()
})

  
export default router
