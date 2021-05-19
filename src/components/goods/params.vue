<template>
    <div>
      <bc>
        <template slot="x">商品管理</template>
        <template slot="y">参数列表</template>
      </bc>

      <el-card>
          <el-alert title="注意:  只允许为第三级分类设置相关参数!" type="warning" :closable="false"  show-icon >
          </el-alert>

          <el-row>
              <el-col>
                <span>选择商品分类: </span>
                <el-cascader v-model="selectedGrandsonKeys" :options="allCateDate" :props="cascaderConfig2"  clearable   @change="cascader2Change"></el-cascader>
                    <!--            ↑选中的数据(必须为数组)       ↑渲染绑定的数据(数组嵌对象)     ↑配置参数对象    ↑ 可清空    ↑选择的内容一变化就触发 即V-model一变就触发 默认传参 新的选中值-->  
            </el-col>
          </el-row>

          <!-- tabs标签页区 -->     
           <el-tabs v-model="activeName"   @tab-click="handleTabsClick">
             <!--  绑定的为Value值 等于哪个name值即当前处于活跃状态的标签页  ;  点击任意标签触发回调函数默认传参(选中的标签实例,事件对象)   -->
             <el-tab-pane label="动态参数" name="many">
                <el-button type='primary' :disabled='!selectedGrandsonKeys.length' @click="isAddParamsDialgShow = true">添加参数</el-button>
                <el-table :data="tableData" border style="width: 100%">
                   <el-table-column type='expand'>
                     <template v-slot:default='scope'>
                       <el-tag :key="i" v-for="(tag,i) in scope.row.attr_vals"  closable  @close="handleTagClose(scope.row.attr_vals,tag,scope.row,i)">
                          {{tag}}
                      </el-tag>
                      <el-input  class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row)" @blur="handleInputConfirm(scope.row.attr_vals,scope.row)"></el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="addTag(scope.row)">+ New Tag</el-button>                    
                     </template>
                   </el-table-column>
                   <el-table-column type='index' label="#" ></el-table-column>
                   <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
                   <el-table-column  label="操作" >
                      <template v-slot:default='scope'>
                        <el-button type="primary" icon="el-icon-edit" size='small' @click="editBtn(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size='small' @click='deleteBtn(scope.row.attr_id)'>删除</el-button>
                      </template>
                   </el-table-column>
                </el-table>
             </el-tab-pane>

             <el-tab-pane label="静态属性" name="only">
                <el-button type='primary' :disabled='!selectedGrandsonKeys.length' @click="isAddParamsDialgShow = true">添加属性</el-button>
                <el-table :data="tableData" border style="width: 100%">
                   <el-table-column type='expand'>
                     <template v-slot:default='scope'>
                       <el-tag :key="i" v-for="(tag,i) in scope.row.attr_vals"  closable  @close="handleTagClose(scope.row.attr_vals,tag,scope.row,i)">
                          {{tag}}
                      </el-tag>
                      <el-input  class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row)" @blur="handleInputConfirm(scope.row.attr_vals,scope.row)"></el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="addTag(scope.row)">+ New Tag</el-button>                    
                     </template>
                   </el-table-column>
                   <el-table-column type='index' label="#" ></el-table-column>
                   <el-table-column prop="attr_name" label="属性名称" ></el-table-column>
                    <el-table-column  label="操作" >
                      <template v-slot:default='scope'>
                        <el-button type="primary" icon="el-icon-edit" size='small' @click="editBtn(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size='small' @click='deleteBtn(scope.row.attr_id)'>删除</el-button>
                      </template>
                    </el-table-column>
                </el-table>
             </el-tab-pane>
           </el-tabs> 

           <!-- 嘿嘿 点一下切换状态   三目！！！ -->     
           <!-- <button @click="activeName = (activeName == 'only') ? 'many' : 'only' ">点一下</button> -->

          <!-- 点击添加参数或者添加属性 弹出的对话框(共用一个)  -->  
          <el-dialog :title="(activeName =='many')? '添加动态参数':'添加静态属性'" :visible.sync="isAddParamsDialgShow" width="30%" @close='addFormClose'>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
               <el-form-item :label="(activeName =='many')? '参数名称: ':'属性名称: '" prop="attr_name">
                 <el-input v-model="addForm.attr_name"></el-input>
               </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="isAddParamsDialgShow = false">取 消</el-button>
              <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 点击编辑按钮 编辑参数或者属性 弹出的对话框(共用一个) -->
          <el-dialog :title="(activeName =='many')? '修改动态参数':'修改静态属性'" :visible.sync="isEditParamsDialgShow" width="30%" @close='editFormClose'>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
               <el-form-item :label="(activeName =='many')? '参数名称: ':'属性名称: '" prop="attr_name">
                 <el-input v-model="editForm.attr_name"></el-input>
               </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="isEditParamsDialgShow = false">取 消</el-button>
              <el-button type="primary" @click="editparams">确 定</el-button>
            </span>
          </el-dialog>

          
      </el-card>
    </div>
</template>

<script>
var a = [1,2,3,4,54,6]
var b = a.slice(a.indexOf(3),a.indexOf(3)+1)
console.log(a );
console.log(b);



export default { 
  name:'',
  data(){
      return {
        //选中的商品分类 只能选3级分类(孙子分类) 数组
        selectedGrandsonKeys:[],

        //级联选择器 渲染数据 
        allCateDate:[],

        //级联选择器 配置 对象
        cascaderConfig2:{
          expandTrigger:'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children',
        },

        // 处于活跃状态的tabs名 等于谁 就可以跳到那个标签页 例↓(默认显示name为many的标签)
        activeName:'many',
        /*  嘿嘿 点一下切换状态   三目！！！  要注意 虽然标签变了 但表格内容没有重新请求区分(用的同一个对象)渲染所以 出BUG了 页面内容没变   
        <button @click="activeName = (activeName == 'only') ? 'many' : 'only' ">点一下</button> */

        // 三级分类参数 的 id    也可以直接用下面的计算属性
        id:null,

        // 动态 静态 参数的渲染数据 
        tableData:[],

        // 是否显示添加参数对话框
        isAddParamsDialgShow:false,

        // 添加 参数/属性 的表单 数据对象
        addForm:{
          attr_name:'',  //不能为空对象，因为是要上传的数据 属性 必须先定义好
        },

        // 添加 参数/属性 的表单 验证规则对象
        addFormRules:{
          attr_name:[{required:true, message: '请输入名称', trigger: 'blur' }]
        },

        // 是否显示 编辑 弹出框
        isEditParamsDialgShow:false,
        
        // 编辑 参数/属性 的表单 数据对象
        editForm:{
          /* attr_name:'', 可为空对象，因为是先请求来数据 赋值给此对象  
             attr_id:'', */ 
        },

        // 编辑 参数/属性 的表单 验证规则对象
        editFormRules:{
          attr_name:[{required:true, message: '请输入名称', trigger: 'blur' }]
        },

      /* 不要这些写 不然这些input框绑定的值都是一样的。要分别绑定 在下面函数 getParamaInfo中才是对的  
        // 渲染输入框还是button按钮 
        inputVisible:false,
        // 动态添加标签 input框绑定的值
        inputValue:'',  */
      }
  },
  methods:{
    //  获取所有商品分类 信息
    async getCateData(){
       const {data : res} = await this.$axios.get('categories',{type:3}).catch(err=>err)
         if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
         this.allCateDate = res.data  
        },

    /* 遍历数组函数         3层 数组对象结构 
    handle(arr){
        arr.forEach(item => {
          if(!item.children){
             this.handle(item.children)
          }
          item.disabled = true;
        });
        console.log(arr);
      },
      这个递归方法 可以给所有有children属性的对象 添加disabled属性为true;
      this.handle(this.allCateDate) 
      */
    
    // 级联选择器 V-model 选中一变就回调
    async cascader2Change(a){   // a跟这个↓为指向同一地址的不同数组 只是属性值相互影响，重新赋值就个管个不影响
      if(a.length !== 3){
        this.selectedGrandsonKeys = [];
        this.tableData = [] // !!! 防止级联选择器为空但是下面table表单不为空还能点击编辑删除按钮 会出错
      }
      /*  这里可以直接请求参数，但是切换TAbs时不会动态请求。只是在级联变化时请求；所以写在↓
      this.id = this.selectedGrandsonKeys[this.selectedGrandsonKeys.length - 1]
      const {data : res } = await this.$axios.get(`categories/${this.id}/attributes`,{params:{sel:this.activeName}}).catch(err=>err)  
      console.log(res); */
      this.getParamaInfo()
    },

    //点击任意tabs标签触发回调函数 默认传参(选中的标签实例,事件对象)
    handleTabsClick(a,b){
      console.log(a,b);
      console.log(this.activeName);
      this.getParamaInfo()
    },

    // 根据级联选中的ID请求这个分类的 动态或 静态参数
    async getParamaInfo(){
      const {data : res } = await this.$axios.get(`categories/${this.getID}/attributes`,{params:{sel:this.activeName}}).catch(err=>err)  
      if(res.meta.status !== 200) return this.$message.error('请选择商品分类')
      res.data.forEach(item=>{
        // 把这两个值在遍历时 给每一行对象都添加为新属性。input数据就会毫无关联
        item.inputVisible=false; 
        item.inputValue = '';
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })
      this.tableData = res.data
      console.log(this.tableData);
    },

    // 关闭添加 参数/属性 对话框     回调函数
    addFormClose(){
       // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
       this.$refs.addFormRef.resetFields()
       /* 移除表单项的校验结果 可传承prop 或者 prop组成的数组 来单个移除表单校验结果
          this.$refs.addFormRef.clearValidate()  */
    },
    
    // 点确定按钮 发送添加 属性/参数 的请求
     addParams(){
       this.$refs.addFormRef.validate(async valid=>{
         if(!valid) return this.$message.error('请输入正确的信息')
         const {data : res} = await this.$axios.post(`categories/${this.getID}/attributes`,{
           attr_name:this.addForm.attr_name,
           attr_sel:this.activeName,
         }).catch(err=>err)
         if(res.meta.status !== 201) return this.$message.error('添加失败')
         this.$message.success('添加成功')
         this.getParamaInfo()
         this.isAddParamsDialgShow = false
       })
    },
    
    // 点击编辑按钮
    async editBtn(id){
       /* this.editForm.attr_name = name  不要这样图简单写
       为了保证准确性，编辑时都要根据Id重新从服务器请求来最新数据 */
       const {data : res} = await this.$axios.get(`categories/${this.getID}/attributes/${id}`,{params:{attr_sel:this.activeName}})
       if(res.meta.status !== 200) return this.$message.error('获取数据失败')
       /* this.editForm.attr_name = res.data.attr_name
          this.editForm.attr_id = res.data.attr_id */
          this.editForm = res.data
       this.isEditParamsDialgShow = true
    },

    // 关闭编辑 参数/属性 对话框     回调函数
    editFormClose(){
         this.$refs.editFormRef.resetFields()
    },

    // 点击确定按钮 发送更改的编辑
    editparams(){
      this.$refs.editFormRef.validate(async valid=>{
         if(!valid) return this.$message.error('请输入正确的信息')
         const {data : res} = await this.$axios.put(`categories/${this.getID}/attributes/${this.editForm.attr_id}`,{
           attr_name:this.editForm.attr_name,
           attr_sel:this.activeName,
         })
         if(res.meta.status !== 200) return this.$message.error('编辑失败')
         this.$message.success('编辑成功')
         this.getParamaInfo()
         this.isEditParamsDialgShow = false
       })
    },

    // 点击删除按钮  回调函数
   async deleteBtn(attr_id){
      const confirm = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)    
      if(confirm !== 'confirm') return this.$message.info('已取消删除')
      const {data : res} = await this.$axios.delete(`categories/${this.getID}/attributes/${attr_id}`)
      if(res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamaInfo()
      this.isEditParamsDialgShow = false
    },

    // 添加tag标签的input框    松开enter键 || 失去焦点blur 事件 触发函数
async handleInputConfirm(arr,row){
      /* 很完美，但输入只输入空格的话。会生成一个空标签，不美观
       if(row.inputValue){
         arr.push(row.inputValue)
       }
       row.inputValue = '';
       row.inputVisible=false; */
       if(row.inputValue.trim().length === 0){
         row.inputValue = '';
         row.inputVisible=false;
         return
       }
       arr.push(row.inputValue.trim())
       row.inputValue = '';
       row.inputVisible=false;
       //发起请求保存这才改变
    const {data : res} = await this.$axios.put(`categories/${this.getID}/attributes/${row.attr_id}`,{
         attr_name:row.attr_name,
         attr_sel:this.activeName,
         attr_vals:arr.join(',')
       })
       if(res.meta.status !== 200) return this.$message.error('添加失败')
       this.$message.success('添加成功')
    },

    // 添加tag标签的button 点击事件
    addTag(row){
      row.inputVisible=true;
      //$nextTick方法的作用：(数据改变刷新了页面) 当页面上元素被重新渲染完之后，肯定会来执行回调函数中的代码类似于mounted(){}
      //虽然row.inputVisible设置为true了，但是因为数据变化页面刷新，此时可能还是button按钮
      //input框还未渲染出来，此时$refs.saveTagInput是找不到元素的。所以必须放在此方法中
      this.$nextTick(_=> {
          this.$refs.saveTagInput.$refs.input.focus();
        });
     /*  this.$nextTick(()=>{
         this.$refs.saveTagInput.focus()
      }) 也可这样写 */
    },
   

    // 点击删除Tag标签的回调函数  删除自己(找到自己在数组中的位置，再用splice切掉)
async handleTagClose(tagArr,tag,row,i){
      let arr = [...tagArr]
      arr.splice(arr.indexOf(tag),1) 
    /* 简洁方法传入索引位   直接删除就是了 
       arr.splice(i,1) 
       Vue.delete(row.attr_vals,i)   */
    const {data : res} = await this.$axios.put(`categories/${this.getID}/attributes/${row.attr_id}`,{
          attr_sel:this.activeName,
          attr_vals:arr.join(','),
          attr_name:row.attr_name
        })
        if(res.meta.status !== 200){
            return  this.$message.error('删除失败')
          }
      res.data.attr_vals = res.data.attr_vals.split(',')
      row.attr_vals = res.data.attr_vals // !!!! 这里不要直接赋值给tagArr这个数组，在组件内不会响应时更新。因为它并不是已经在data里面定义好的数据属性
      // !!!! 在组件内 还是直接赋值从而更改对象的属性 更好。  函数内row.attr_vals重新赋值后与tagArr不指向同一地址了;再次执行函数tagArr才会再次指向它的地址
      console.log(row.attr_vals); 
      this.$message.success('删除成功')
    },

    
  },
  created(){
    this.getCateData()
  },
  components:{},
  mounted(){

  },
  computed:{ 
    getID(){
      if(this.selectedGrandsonKeys.length === 3){
         return this.selectedGrandsonKeys[2]
      }
      return null 
    },
  }


}

</script>


<style scoped>

.el-alert{
    margin-bottom: 14px;
}

.el-tag{
    margin: 10px;
}

.input-new-tag {
    width: 150px;
}
</style>