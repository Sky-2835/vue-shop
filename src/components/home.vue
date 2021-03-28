<template>
  <div class="home">
      我是home
      <el-button type="info" round class="back" @click="logout()">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() { 
    return {

    }
  },
  props: {

  },
  components:{
  },
  mounted(){

  },
  methods:{
   logout(){
       window.sessionStorage.clear()  //清空缓存
       this.$router.push({path:'/login'})
   }
  },
 }
</script>

<style scope>
.back{
    position: absolute;
    right: 0px;
}
</style>