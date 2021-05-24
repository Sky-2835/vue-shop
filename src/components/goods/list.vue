<template>
  <div>
    <bc>
        <template slot="x">商品管理</template>
        <template slot="y">商品列表</template>
    </bc>
    <div v-show="isGoodsShow">
     <el-card>
       <el-row :gutter='25'>
         <el-col :span='7'>
           <el-input placeholder="请输入内容" v-model="params.query" :key="1" clearable  @clear='ClearInput' @input="getAllGoogsData">
              <el-button slot="append" icon="el-icon-search" @click="getAllGoogsData"></el-button>
           </el-input>
         </el-col>
         <el-col :span='8'> 
          <!--   本来是 点击按钮通过 v-show 切换Div显示。但弄了个新路由页面  --> 
          <!--   <el-button type="primary" @click="isGoodsShow=false">添加商品</el-button> -->
            <el-button type="primary" @click="jumpAddVue()">添加商品</el-button>
         </el-col>
       </el-row>

       <el-table :data="tableData"  border style="width: 100%">
        <el-table-column type='index' label="#" ></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width='400'></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" align='center'></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" align='center' ></el-table-column>
        <el-table-column  label="创建时间"  align='center'>
          <template v-slot:default='scope'>
             {{scope.row.add_time | dateFormat}}
          </template>  
        </el-table-column>
        <el-table-column  label="操作" >
          <template v-slot:default = 'scope'>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size='small' @click="EditGoods(scope.row.goods_id)"></el-button>
            </el-tooltip>  
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size='small' @click="removeGoods(scope.row)"></el-button>
            </el-tooltip>  
          </template>
        </el-table-column>
       </el-table>  

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[10,20,30,40,50]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
     </el-card>
    </div>
    <div v-show="!isGoodsShow">
      hello world
    </div>
  </div>
</template>




<script>

export default {
  data() {
    return {
      //请求参数对象
      params:{
        // 搜索框 双向数据
        query:'',

        pagenum:1,
        pagesize:10,
      },
      // 谁显示 本来是控制2个DIV谁显示，但是现在直接弄了个新路由页面 用不上了
      isGoodsShow:true,
      
      // 渲染表单数据
      tableData:[],

      // 商品总数
      total:null,
    };
  },

  methods: {
    // 请求 商品列表(所有商品)数据
  async getAllGoogsData(){
    const {data : res } = await this.$axios.get(`goods`,{params:this.params})
    if(res.meta.status !== 200) return this.$message.error('获取数据失败')
    console.log(res.data);
   /*  this.$message.success('获取数据成功') */
    this.tableData = res.data.goods
    this.total = res.data.total
    },

    //清空搜索框clear事件 回调函数 也可直接@clear=getAllGoogsData(),因为点击了×触发事件时，先会将输入框的值清空。所以效果一样
    ClearInput(){
      this.params.query='';
      this.getAllGoogsData()
    },

    //分页条 页面改变 回调函数
    handleSizeChange(newSize){
       this.params.pagesize = newSize
       this.getAllGoogsData()
    },
    
    //分页条 条数改变 回调函数
    handleCurrentChange(newNum){
      this.params.pagenum = newNum
      this.getAllGoogsData()
    },

    // 删除按钮 删除商品
 async removeGoods(row){
   const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
    if(confirm !== 'confirm') return this.$message.info('已取消删除')
    const {data : res} = await this.$axios.delete(`goods/${row.goods_id}`)
        if(res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getAllGoogsData()
    },
    // 编辑按钮 跳转到编辑商品路由页面
    EditGoods(goods_id){
      this.$router.push({path:'goods/edit',query:{goods_id}})
    },

    // 点击添加商品按钮 跳转到添加商品路由页面 
    jumpAddVue(){
      this.$router.push({path:'goods/add'})
    },
  },
  computed: {},
  created() {
    this.getAllGoogsData()
  },
  mounted() {
  },
  updated() {},
  filters: {},
  component: {},
};
</script>

<style scoped>

</style>
