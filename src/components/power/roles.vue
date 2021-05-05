<template>
    <div class="roles"> 
        <bc>
            <template slot="x">权限管理</template>
            <template slot="y">角色列表</template>
        </bc>
    <el-card>
       <el-row :gutter='20'>
          <el-col :span='8'>
              <el-button type='primary'  @click="isdialogshow = true">添加角色</el-button>
          </el-col>
       </el-row>
        <el-table :data="listData" primary border style="width: 100%">
             <!-- 设置展开 列 -->
             <el-table-column type="expand" >
                 <template v-slot:default='scope'>
                     <el-row :class="{bdtop: index !== 0}"  :gutter='20' v-for="(item,index) in scope.row.children" :key="item.id" type='flex' align='middle'>
                         <el-col :span='5'><el-tag closable @close='removeRights(scope.row,item.id)'>{{item.authName}}</el-tag ><i class="el-icon-caret-right"></i></el-col>
                         <el-col :span='19'>
                             <el-row  :class="{bdbottom:indexson<itemson.length,bdtop: indexson !== 0}" :gutter='20' type='flex' align='middle'
                              v-for='(itemson,indexson) in item.children' :key="itemson.id">
                                 <el-col :span='6'>
                                     <el-tag closable type='success' @close='removeRights(scope.row,itemson.id)'>{{itemson.authName}}</el-tag>
                                     <i class="el-icon-caret-right"></i>
                                 </el-col>
                                 <el-col :span='18'>
                                     <el-tag type='warning' closable @close='removeRights(scope.row,itemgrandson.id)'
                                     v-for='(itemgrandson) in itemson.children' :key="itemgrandson.id">
                                     {{itemgrandson.authName}}
                                     </el-tag>
                                 </el-col>
                             </el-row>
                         </el-col>
                     </el-row>
                 </template>
             </el-table-column>
             <!-- 设置索引 列 -->
             <el-table-column type="index" label="#" > </el-table-column>
             <el-table-column prop='roleName' label="角色名称" > </el-table-column>
             <el-table-column prop='roleDesc' label="角色描述" > </el-table-column>
             <el-table-column  label="操作" width='300px'>
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="btnEditUsers(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUsers(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="small" @click="changeRights(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
     <!-- 添加角色对话框 -->
     <el-dialog title="添加用户" :visible.sync="isdialogshow"   width="30%"          @close='resetform1()' >
                             <!--  是否显示对话框                 宽度               事件，dialog对话框一关闭，执行函数清空表单内容 -->  

     <el-form :model="addusers" :rules="form1rules" ref="form1" label-width="100px" >
        <el-form-item label="角色名称" prop="roleName">
           <el-input v-model="addusers.roleName"></el-input>
       </el-form-item>
       <el-form-item label="角色描述" prop="roleDesc">
           <el-input v-model="addusers.roleDesc"></el-input>
       </el-form-item>   
     </el-form> 
     <span slot="footer" class="dialog-footer">
        <el-button @click="isdialogshow = false;">取 消</el-button>
        <el-button type="primary" @click="setusers()">确 定</el-button>
      </span>                        
     </el-dialog> 

     <!-- 编辑角色对话框 -->
     <el-dialog
      title="编辑角色" :visible.sync="IsEditDialogShow"  width="30%"  @close='resetform2()'>
      <el-form :model="editusers" :rules="form1rules" ref="form2" label-width="100px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editusers.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editusers.roleDesc"></el-input>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="IsEditDialogShow = false">取 消</el-button>
         <el-button type="primary" @click="setEditusers()">确 定</el-button>
       </span>
     </el-dialog>    

     <!-- 添加分配权限对话框 -->
     <el-dialog title="分配权限" :visible.sync="isChangeDialogShow" width="50%"  @close='resetDefaultKeys()'>
         <!-- 树形结构 -->                       <!-- ↓显示复选框     ↓是否默认展开所有节点 ↓获取和设置选中节点(通过数据对象中的id值)-->
        <el-tree :data="treeData" :props="treeProps" show-checkbox  default-expand-all  node-key='id' :default-checked-keys='defaultKeys' ref='tree'></el-tree>
        <!--           ↑对应的数据对象  ↑(对象) 1在前面对象中所有分层靠哪个属性相连接 2每一层显示(所有显示)的是哪个属性的属性值 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="isChangeDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="setChangeRights()">确 定</el-button>
       </span>
    </el-dialog>  
</div>
</template>


<script>
export default {
    name:'roles',
    data(){
        return {
           listData:null,
           isdialogshow:false,
           IsEditDialogShow:false,
           isChangeDialogShow:false,
           // 添加用户时 所需表单数据
           addusers:{
             roleId:null,       // 这些属性必须要声明，因为不会请求数据 赋值给此对象
             roleName:null,
             roleDesc:null,
           },
           // 编辑用户时 默认表单数据
           editusers:{
             /* roleId:null,     可以不声明这些数据，因为先会把请求来的数据直接赋值给此对象，
                roleName:null,               所以v-model双向绑定也无所谓
                roleDesc:null,  */
           },
           // 表单验证
           form1rules:{
             roleName:[
                  { required: true, message: '请输入角色名称', trigger: 'blur' },
               { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur','change'] }
             ],
             roleDesc:[
                  { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur','change'] }
             ],
           },
           form2rules:{
               roleName:[],
               roleDesc:[]
           },
           // 树形结构对应的数据对象
           treeData:null,
           // 树形结构参数对象
           treeProps:{
               children:'children',// 父子节点通过哪个属性嵌套链接的
               label:'authName'  //看到的是哪个属性对应的属性值
           },
           // 默认勾选的节点数据(数组)
           defaultKeys:[],
           // 中转下 即将分配权限的id 角色id
           usersId:null,
        }
    },
    methods:{
        //获取列表数据
        async getListDate(){
            const {data : res} = await this.$axios.get('roles') 
            if(res.meta.status !== 200) return this.$message.error('获取列表数据失败') 
            this.listData = res.data   
            console.log(this.listData);
        },
        // 关闭dialog时，清空里面表单的数据
        resetform1(){
             this.$refs.form1.resetFields()
        },
        // 添加用户
        setusers(){
          this.$refs.form1.validate(  async vaild=>{
          if(!vaild) return this.$message.error('请输入正确的信息');
          const {data : res} = await this.$axios({method:'post',url:'roles',data:this.addusers})
          if(res.meta.status !== 201) return this.$message.error('添加角色失败');
          this.$message.success('添加角色成功')
          this.isdialogshow = false;
          this.getListDate()
      })
        },
        resetform2(){
            this.$refs.form2.resetFields()
        },
        //根据id获取编辑框内表单数据
        async btnEditUsers(id){
          this.IsEditDialogShow = true;
                const {data : res}  = await this.$axios.get(`roles/${id}`)
                if(res.meta.status !== 200) return this.$message.error('获取信息失败')
                this.editusers = res.data
        },
        // 点击编辑用户内的确定按钮
        setEditusers(){
            this.IsEditDialogShow = false;
            this.$refs.form2.validate( async vaild=>{
                if(!vaild) return this.$message.error('请输入正确的信息');
                const{data : res} = await this.$axios.put(`roles/${this.editusers.roleId}`,this.editusers)
                if(res.meta.status !== 200) return this.$message.error('修改信息失败')
                this.$message.success('修改信息成功')
                this.getListDate()
            })
        },
        // 删除按钮
     async removeUsers(id){
       const confirmReslt = await this.$confirm('此操作将永久删除该用户, 是否继续?','提示',{
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
              }).catch(err=>err)
        if(confirmReslt !== 'confirm') return this.$message.info('已取消删除')
        const {data : res} = await this.$axios.delete(`roles/${id}`)
        if(res.meta.status !== 200) return this.$message.error('删除角色失败')
        this.$message.success('删除角色成功')
        this.getListDate()
        },
        //删除角色指定权限
      async removeRights(role,id){
           const confirmReslt = await this.$confirm('此操作将永久删除该权限, 是否继续?','提示',{
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
              }).catch(err=>err)
            if(confirmReslt !== 'confirm') return this.$message.error('取消删除权限')
            const {data : res} = await this.$axios.delete(`roles/${role.id}/rights/${id}`)
            if(res.meta.status !==200) return this.$message.error('取消权限失败')
            this.$message.success('取消权限成功')
            // 把新请求来的数据 赋值给 这行数据对象的children属性身上，从而重新渲染这行。即就会动态删除这个tag标签 
            // 这里重新赋值能做到响应式改变 因为符合 obj.xx = xxx    对象属性重新赋值 详见v-for.html
            role.children = res.data
        },
        // 分配权限按钮
       async changeRights(children){
             this.isChangeDialogShow = true;
             const {data : res} = await this.$axios.get('rights/tree')
             if(res.meta.status !== 200) return this.$message.error('获取信息失败')
             this.treeData = res.data
             // 拿到所有3级权限的id值传入 默认勾选的数组中
             /* for(let prop of children){
               for(let prop2 of prop.children){
                   for(let prop3 of prop2.children){
                           this.defaultKeys.push(prop3.id)
                       }
                   }
               } */
             // 用递归函数时,这里传入的children 应该是scope.row(对象);而不是上面的scope.row.children(数组)
              this.getId(children,this.defaultKeys) 
              // 把角色id先保存出去 点确定按钮，发送更改的权限 请求时会用到
              this.usersId = children.id
        },
        // 关闭dialog时,把默认勾选的节点数据(数组) 数组清零
        resetDefaultKeys(){
            this.defaultKeys = []
        },
        // 用递归函数 获取所有3级权限ID 
        getId(obj,arr){
            //当对象不包含children属性时 将id push到目标目标数组
          if(!obj.children){
             return arr.push(obj.id)
          } //当对象包含时，因为chilren是个数组 所以遍历数组 将每一个对象成员放入这个函数中递归
          obj.children.forEach(item => {
              this.getId(item,arr)
          });
        },
        //点确定按钮，发送更改的权限
       async setChangeRights(){
        let arr = [...this.$refs.tree.getCheckedKeys(),  // 当前树形结构中被选中的节点的key值，即设定的id值组成的数组
                   ...this.$refs.tree.getHalfCheckedKeys()]// 当前树形结构中半选中的节点的key值，即设定的id值组成的数组          
        let str = arr.join()
        this.isChangeDialogShow = false
        const {data : res} = await this.$axios.post(`roles/${this.usersId}/rights`,{
                   rids:str
                }).catch(err=>err)
            if(res.meta.status !== 200) return this.$message.error('分配权限失败')
            this.$message.success('分配权限成功')
         this.getListDate()    
        }
      
       

    },
    created(){
        this.getListDate()
    },
    mountd(){},
    filters:{},

}
</script>

<style scoped>
.el-tag{
    margin: 7px;
}

.bdtop{
    border-top:1px solid #eee;
}
.bdbottom{
    border-bottom:1px solid #eee;
}
</style>




