<template>
  <div class="rights">
   <!-- 面包屑导航区 -->   
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 --> 
    <el-card>
      <!-- 表单区 -->
      <el-table :data="listData" border stripe style="width: 100%">
        <el-table-column type="index" label="#" > </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级"> 
            <template slot-scope='scope'>
              <!-- 通过判断level等级 渲染不同的tag标签 -->
              <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
              <el-tag v-else-if='scope.row.level === "1"'  type="success">等级二</el-tag>
              <el-tag v-else type="warning">等级三</el-tag>
            </template> 
        </el-table-column>
      </el-table>
    </el-card>
    
  </div>
</template>

<script>

export default {
  name: 'rights',
  data() { 
    return {
      listData:null, 
    }
  },
  props: {

  },
  components:{
  },
  created(){
    this.getListdata()                   
  },
  mounted() {
     
  },
  methods:{
    async getListdata(){
         const {data : res} = await this.$axios({
                                      method:'get',
                                      url:'rights/list'
                                })
    if(res.meta.status !== 200) return this.$message.error('获取权限列表数据失败') 
    this.listData = res.data         
     }
  },
 }
</script>

<style scoped>
</style>