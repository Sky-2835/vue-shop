<template>
  <div id="app">
   <router-view></router-view> 
   <!--  <router-link to='/helloWorld'><button class="bbb1">点我下好嘛</button></router-link>
    <router-link to='/login'><button class="bbb2" style="left:90px">跳转登陆界面</button></router-link> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data(){
    return {
      
    }
  }
}
</script>

<style >
@import './assets/css/base.css';
  [class^=bbb]{
    position: absolute;
    bottom:0px;
  }
</style>
