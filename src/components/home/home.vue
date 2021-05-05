<template>
  <div class="home" style="height:100%">
    <el-container style="height:100%">
      <el-header>
        <div>
          <img src="../../assets/logo.png" alt="" style="height:60px;width:60px;vertical-align: middle;"  >
          <span style="padding-left:5px">电商后台管理系统</span>
        </div>
        <el-button type="info" round class="back" @click="logout()">退出</el-button>
        </el-header>
      <el-container>
        <el-aside :width="isClose ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleColse()"> <!-- {{isClose ? '&#xe751;' : '&#xe752;'}} unicode引用  base64编码不对。全是小框框 -->
             <!--  <i v-show="!isClose" class="iconfont icon-zuojiantou"></i>
                   <i v-show="isClose"  class="iconfont icon-youjiantou"></i>   -->
              <i :class='{"iconfont icon-zuojiantou":!isClose,"iconfont icon-youjiantou":isClose}'></i>
          </div>
         <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"  
      style="border:0px" 
      :unique-opened='true'  :collapse='isClose'  :collapse-transition='false' :router = 'true'                              :default-active='active' > 
     <!-- 只保持一个子菜单打开    是否折叠                折叠动画            是否开启路由模式 开启后 ?二级菜单的index值就为path值   当前哪个二级菜单文字高亮
                                                                                                                              值为二级菜单的index值 -->                                 
      <el-submenu :index="item.id+''" v-for="(item,num) in asidedata"  :key="item.id">
        <template slot="title">
          <i :class="icon[num]"></i>
          <span>{{item.authName}}</span>                              <!-- 因为路径前面不加 / 则默认为子路径 $router.push({path:' 当前页面 + ↑  ';query:{}}) -->
        </template>  <!-- ！！！前面加↓了 / 就直接跳转为$router.push({path:'index值';})设置为子路由时也要加上/   这里如果不加则 如上↑ -->
          <el-menu-item :index="'/'+ itemson.path" v-for="itemson in item.children" :key="itemson.id" @click='Index("/"+ itemson.path)'>
            <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{itemson.authName}}</span>
            </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
        </el-aside>
        <el-main>
        <router-view/> 
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {aGetAsideData} from '../../network/home.js';

export default {
  name: "home",
  data() {
    return {
      asidedata:[],
      icon:['iconfont icon-users','iconfont icon-zhongchuangkongjian-','iconfont icon-shangpin','iconfont icon-danju-tianchong','iconfont icon-baobiao'],
      isClose:false,
      active:'',
    };
  },
  props: {},
  components: {},

  created(){
    this.getAsidedata();
    this.active = window.sessionStorage.getItem('index'); 
 },
  methods: {
    logout(){
      window.sessionStorage.clear(); //清空缓存       清单个window.sessionStorage.removeItem('index')
      this.$router.push({ path: "/login" });
    },
    
    async getAsidedata(){
    const { data : res }  = await aGetAsideData()
      if(res.meta.status !== 200){return this.$message.error('获取数据失败了')}
      this.asidedata = res.data
      console.log(this.asidedata);
    },
    
    toggleColse(){
      this.isClose = !this.isClose;
    },
    Index(a){
      window.sessionStorage.setItem('index',a)
      this.active =  a
    },
 }
}
</script>

<style scoped>

 .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    color: #fff;
    padding-left:0px;
    align-items: center;
    font-size: 20px;
   /*  text-align: center;
    line-height: 60px; */
  }
  
  .el-aside {
    background-color: #333744;
   /*  color: #333;
    text-align: center;
    line-height: 200px; */
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4a5064;
    text-align: center;
    font-size: 10px;
    color: #fff;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor:pointer;
  }
  
  .el-main {
    background-color: #Eaedf1;
    /* color: #333;
    text-align: center;
    line-height: 160px; */
  }
  
  /* body > .el-container {
    margin-bottom: 40px;
  } */
  
  /* .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }  */
</style>