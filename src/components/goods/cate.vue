<template>
  <div>
    <bc>
        <template slot="x">商品管理</template>
        <template slot="y">商品分类</template>
    </bc>
    <el-card>
      <el-row>
          <el-col>
              <el-button  type='primary' @click="showAddCateDialog">添加分类</el-button>
          </el-col>
      </el-row>
       
      <!-- 这整个组件 最终渲染出来 class = 'zk-table       '  -->
      <table-Tree :data='cateList'  :columns='columns' show-index index-text='#' border :selection-type='false' :expand-type='false' :show-row-hover='false'>
          <!-- 是否有效 列 -->
          <template #isok='scope'> <!-- v-slot:isok='scope'; slot='isok' slot-scope='scope' -->
             <i class="el-icon-success" v-if='!scope.row.cat_deleted' style="color:lightgreen;transform:scale(1.5)"></i>
             <i class="el-icon-error" v-else style="color:red;transform:scale(1.5)"></i>
          </template><!-- 与el-table一样，scope.row为这行对应的对象 -->
          <!-- 排序 列 -->
          <template #level='scope'>
            <el-tag v-if='scope.row.cat_level === 0' size="small">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type='success' size="small">二级</el-tag>
            <el-tag v-else type='warning' size="small">三级</el-tag>
          </template>
         <!-- 操作 列 --> 
         <template #edit='scope'>
           <el-button type="primary" icon="el-icon-edit" size="small" @click="editCate(scope.row.cat_id)">编辑</el-button>
           <el-button type="danger" icon="el-icon-delete" size="small" @click="removeCate(scope.row.cat_id)">删除</el-button>
         </template>
      </table-Tree> 
      
      <!-- 分页条 -->
      <el-pagination
      @size-change="pageSizeChange"     
      @current-change="pagenumChange" 
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 8, 12, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
      </el-pagination>
      {{total}}
    </el-card>

    <!-- 添加分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="isAddCateDialogShow" width="30%" @close='closeCateDialog'>
      <el-form :model="cateData" :rules="rules" ref="Form1" label-width="100px" >
         <!--  输入框 -->
         <el-form-item label="分类名称 :" prop="cat_name" :rules="[{required: true, message: '请输入分类名称', trigger: ['blur','change']},{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: ['blur','change'] }]">
            <el-input v-model="cateData.cat_name"></el-input>
         </el-form-item>
         <!-- 级联选择器 -->
         <el-form-item label='父级分类'>
             <el-cascader v-model="selectedParentKeys" :options="parentData" :props="cascaderConfig"  clearable   @change="ParentKeysChange"></el-cascader>
             <!--             ↑选中的数据(必须为数组)    ↑渲染绑定的数据(数组嵌对象)     ↑配置参数对象    ↑ 可清空    ↑选择的内容一变化就触发 即V-model一变就触发 默认传参 新的选中值-->      
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddCateDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addCategories()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加编辑弹出框 -->
    <el-dialog title="编辑分类" :visible.sync="isEditCateDialogShow" width="30%" >
      <el-form :model="editFormData"  ref="Form2" label-width="100px" >
         <!--  输入框 -->
         <el-form-item label="分类名称 :" prop="cat_name" :rules="[{required: true, message: '请输入分类名称', trigger: ['blur','change']},{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: ['blur','change'] }]">
            <el-input v-model="editFormData.cat_name"></el-input>
         </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditCateDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'cate',
  data() { 
    return {
        // 所有商品分类数据 列表
        cateList:[],
        // 请求(查询)参数
        queryInfo:{
          //代表第三层数据列表(即连同二层(爸爸)，一层(爷爷)一同全部请求)
          type:3,
          //默认请求第一页数据
          pagenum:1,
          //每页5条数据
          pagesize:5,
        },
        // 总条数
        total:null,

        //tabletree组件 表格各列的配置 (数组)
        columns:[    // 1列一个对象
          {
             label:'分类名称', // 列名
             prop:'cat_name', // 列对应的值
          },
          {
            label:'是否有效', 
            type:'template', // 将当前列 当成自定义模板列(对应一个作用域标签)  
            template:'isok', // 对应的作用域标签名(v-slot='isok')
          },
          {
            label:'排序',
            type:'template',
            template:'level',
          },
          { 
            label:'操作',
            type:'template',
            template:'edit', 
          },
        ],
        // 是否显示添加分类弹出框
        isAddCateDialogShow : false,
        // 添加分类的form表单数据 对象
        cateData:{
           // 输入框数据 需要添加的分类的名称
           cat_name:null,
           // 需要添加的分类的层级 0,1,2
           cat_level:0,
           // 需要添加的分类的父级id 1级分类父ID为0
           cat_pid:0,
        },
        // 表单验证 对象
        rules:{
          cat_name:[{},{}],
        },
        // 所有父级分类数据 数组
        parentData:[],
        // 选中的父级分类数据(级联选择器选中的数据)
        selectedParentKeys:[],
        // 级联选择器配置 对象
        cascaderConfig:{   // 根据OPtions绑定的数组
           expandTrigger: 'hover', // 展开方式 是click 还是 hover
           value:'cat_id',       //选中的数据 放入selectedParentKeys数组中与V-model双向绑定
           label:'cat_name',     // 显示选中的数据
           children:'children',  // 指定选项的子选项为选项对象的某个属性值
           checkStrictly:true, //默认只能选择最后一级的数据，设置为true可直接只选择父级的分类
        },
        //添加分类 post参数 对象
        postConfig:{},  //  这里直接用上面写的cateDate对象(我写的一样的)
        //是否显示编辑弹出框
        isEditCateDialogShow : false,

        //编辑分类 Form表单 数据 对象
        editFormData:{}
    }
  },
  props: {

  },
  components:{
  },
  mounted() {

  },
  created(){
    this.getCateList()
  },
  methods:{
    //获取所有商品分类数据
    async getCateList(){
      const {data:res} = await this.$axios.get('categories',{params:this.queryInfo}).catch(err=>err)/* ({
                                    url:'categories',
                                     method:'get',
                                     params:this.queryInfo,
                                   }).catch(err=>err) */
      if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
      console.log(res);  
      // 将请求来的 所有商品分类数据 赋值给cateList
      this.cateList = res.data.result 
      // 将请求来的 数据总条数 赋值给total
      this.total = res.data.total
      },
    // 分页条 设置 显示的每页几条改变 就回调此函数 默认传参新的每页条数
      pageSizeChange(newpageszie){
        this.queryInfo.pagesize = newpageszie
        //根据新的query对象 重新请求数据 渲染列表
        this.getCateList()
      },
    // 分页条 设置 改变页数 就回调此函数 默认传参新的页数
      pagenumChange(newpagenum){
        this.queryInfo.pagenum = newpagenum
        this.getCateList()
      },
    // 点击添加分类按钮
     async showAddCateDialog(){
         // 请求所有父级商品分类数据  即type为2级分类就行了,会连同1级分类数据一起请求 
      const {data : res} = await this.$axios.get('categories', {params:{type:2}}).catch(err=>err)
          if(res.meta.status !== 200) return this.$message.error('获取所有父级分类数据失败')
          this.parentData = res.data
      this.isAddCateDialogShow = true
      },
    // 级联选择器 选中项改变则触发事件的回调函数(默认传参 新的选中项)
     ParentKeysChange(a){ //a就是v-model绑定的数组selectedParentKeys
                           //所以能用a或者是this.selectedParentKeys

         /* if(this.selectedParentKeys[1]){
          this.cateData.cat_pid = this.selectedParentKeys[1];
          this.cateData.cat_level = 2
          }else if(this.selectedParentKeys[0]){
          this.cateData.cat_pid = this.selectedParentKeys[0]; 
          this.cateData.cat_level = 1 
          }else{
            this.cateData.cat_pid = 0;
            this.cateData.cat_level = 0;
          }
          console.log(this.cateData); */
          /* 与上面一样 数组最后一位是 [xxx.length - 1] */
          // 拿到post参数
          if(this.selectedParentKeys.length > 0){
            this.cateData.cat_pid = this.selectedParentKeys[this.selectedParentKeys.length - 1]
            this.cateData.cat_level = this.selectedParentKeys.length
          }else{
            this.cateData.cat_pid = 0;
            this.cateData.cat_level = 0;
          } 
      },
    // 点击确定按钮 添加分类
      addCategories(){
        this.$refs.Form1.validate( async validate=>{
          if(!validate) return this.$message.error('请输入正确的分类名称')
          console.log(this.cateData);
          const { data : res } = await this.$axios({url:'categories',method:'post',data:this.cateData})
          if(res.meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
          this.getCateList()
          this.isAddCateDialogShow = false;
        })               
      },
    // 关闭分类弹出框 回调函数 清空表单跟级联选择器数据
      closeCateDialog(){
        this.$refs.Form1.resetFields();
        this.selectedParentKeys = [];
        this.cateData.cat_level = null;
        this.cateData.cat_pid = null;
      },

    // 点击编辑按钮
 async editCate(id){
        this.isEditCateDialogShow = true;
     const {data : res } = await this.$axios.get(`categories/${id}`)
        if(res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.editFormData = res.data 
     },

     //点击删除按钮
 async removeCate(id){
    const confirmInfo = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmInfo !== 'confirm') return this.$message.info('已取消删除')
     const {data : res} = await this.$axios.delete(`categories/${id}`)   
      if(res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success("删除成功")
      this.getCateList()
     },

     // 确定编辑按钮
  async addEdit(){
      const {data : res } = await this.$axios.put(`categories/${this.editFormData.cat_id}`,{cat_name:this.editFormData.cat_name})
      if(res.meta.status !== 200) return this.$message.error('更新失败')
      console.log(this.editFormData.cat_name);
      this.$message.success("更新成功")
      this.getCateList()
      this.isEditCateDialogShow = false
     }
    
  },
 }
</script>

<style scoped>
   .zk-table{
     font-size: 14px;
   }
   .el-row{
     margin-bottom: 15px;
   }
   .el-cascader{   
     width:100%;
   }

</style>
