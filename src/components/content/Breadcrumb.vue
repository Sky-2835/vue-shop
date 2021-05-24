<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item ><slot name="x"></slot></el-breadcrumb-item>
      <el-breadcrumb-item><slot name="y"></slot></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() { 
    return {

    }
  },
  props: {
  
  },
  components:{
  },
  mounted() {

  },
  methods:{

  },
 }
</script>

<style scoped>
</style>