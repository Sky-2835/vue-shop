<template>
  <div id="app">
    <router-view></router-view>
     <div class="block">
    <span class="demonstration">这是我的轮播图</span>
    <el-carousel height="300px" direction="vertical" >
      <el-carousel-item v-for="(item,index) in imgdata" :key="index">
        <img :src="item" alt="肿么了">
      </el-carousel-item> 
    </el-carousel>
    </div>
    <router-link to='/helloWorld'><button class="bbb1">点我下好嘛</button></router-link>
    <router-link to='/login'><button class="bbb2" style="left:90px">跳转登陆界面</button></router-link>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data(){
    return {
      imgdata:[require('../../vuecli4test/img/1.jpg'),require('../../vuecli4test/img/2.jpg'),require('../../vuecli4test/img/4.jpg'),require('../../vuecli4test/img/4.jpg'),require('../../vuecli4test/img/5.jpg')],
     /*  img:'@/assets/logo.png' */
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
   .block{
     position: absolute;
     width: 400px;
     left:50%;
     margin-left: -200px;
     bottom: 0px;
   }
   .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  
  img{
    width: 100%;
    height: 100%;
  }
</style>
