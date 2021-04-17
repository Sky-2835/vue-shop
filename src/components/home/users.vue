<template>
  <div class="users">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20"> <!-- gutter 每一栏之间相互间隔 20px ; type = 'flex' justify = 'start'('end')之类 让儿子el-col排列-->
        <!-- 搜索框 -->
        <el-col :span="8">  <!-- 总宽度 24 它占8  :offset="6" 向左偏移了 6宽度 -->
          <!-- 搜索框双向绑定params.query值，在发送请求时根据这个值，响应来对应数据  -->
          <el-input  placeholder="请输入内容"  v-model="params.query"  clearable  @clear="GetUsersList()" >
                                                             <!--  清除表内数据(点击××);清除数据时触发clear事件    -->
          <el-button   slot="append"   icon="el-icon-search"   @click="GetUsersList"  ></el-button>
          <!--                                              绑定事件  点击发送↑请求  ↑ 达到搜素功能  -->
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4"> 
          <el-button type="primary" @click="isdialogshow = true">添加用户</el-button></el-col>
      </el-row>

      <!-- 表单区域 -->
      <el-table
        :data="UsersList"
        :stripe="true"
        :border="true"
        style="width: 100%" >
      <!-- 根据date绑定的数组对象v-for遍历 有几个属性值，生成几行  -->

        <el-table-column type="index" label="#"></el-table-column>
        <!-- 变为索引列 -->

        <el-table-column prop="username" label="姓名"> </el-table-column>
        <!-- 每一 列 对应的列名  prop属性来对应对象中的键名即可填入数据-->
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>

        <el-table-column label="状态">
          <template v-slot:default="scope">
            <!-- 或者 slot-scope = 'scope'   el自己封装的组件，自带匿名作用域插槽  .row就是 这行 整个数据对象-->
            <!--  {{scope.row}} -->
            <el-switch  v-model="scope.row.mg_state"  @change="switchChange(scope.row)" > </el-switch>
          </template>
                                  <!-- 状态改变时, .mg_state值是布尔值(自动改变)  触发事件传入整个数据对象 -->
        </el-table-column>

        <el-table-column label="操作" width = '180px'>  <!-- ?最好不要写死 宽度 -->
          <template v-slot:default='scope'>
            <el-button  type="primary"  icon="el-icon-edit"  size="small" @click="showEditDialog(scope.row.id)" ></el-button>
            <el-button  type="danger"  icon="el-icon-delete"  size="small"  @click='removeUserByID(scope.row.id)' ></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
               <el-button  type="warning"  icon="el-icon-setting"  size="small" ></el-button>
            </el-tooltip> 
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 原本没加就不要在方法后面加括号，免得默认传参位置变了，成undefined -->
      <!-- 页面改变触发事件  每页显示条数改变触发事件 当前页面 下拉框选择每页显示条数  每页条数  分页栏需要显示的结构   共多少条数据-->
    </el-card>

    <!-- 添加用户 弹出的的对话框 -->
    <el-dialog title="添加用户" :visible.sync="isdialogshow"   width="50%"          @close='resetform1()' >
                             <!--  是否显示对话框                 宽度               事件，dialog对话框一关闭，执行函数清空表单内容 -->  
      <!-- 添加form表单 -->     
      <el-form :model="addusers" :rules="form1rules" ref="form1" label-width="100px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addusers.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addusers.password" show-password placeholder="请输入密码"></el-input> <!-- show-password直接得到一个可切换显示隐藏的密码框 -->
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                                                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <!-- 可以直接在行间 :rules = '[{},{}]'添加校验规则     type:'email直接校验是否为邮箱'-->  
          <el-input v-model="addusers.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addusers.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isdialogshow = false;">取 消</el-button>
        <el-button type="primary" @click="setusers()">确 定</el-button>
      </span>    
      </el-dialog>  

    <!-- 编辑用户 弹出的对话框 --> 
    <el-dialog  title="修改用户信息"  :visible.sync="IsEditDialogShow"  width="50%" @close='resetform2()' >
    <el-form ref="form2" :model="editForm" label-width="70px" :rules='form2rules'>
       <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
       </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editForm.email" ></el-input>
       </el-form-item>
        <el-form-item label="手机" prop='mobile'>
          <el-input v-model="editForm.mobile" ></el-input>
       </el-form-item>
    </el-form>   
      <span slot="footer" class="dialog-footer">
         <el-button @click="IsEditDialogShow = false">取 消</el-button>
         <el-button type="primary" @click="setEditusers()">确 定</el-button>
     </span>
   </el-dialog> 
    

    <h2>{{ UsersList }}</h2>
    <h2>{{ total }}</h2>
  </div>
</template>

<script>
import { aGetUsersList } from "network/users.js";
import { aUserStatechange } from "network/users.js";
import { aSetNewUsers } from 'network/users.js';
import {  aEditUsers }    from 'network/users.js';
import {  aSetEditUsers }    from 'network/users.js';
import { aDeleteUser }    from 'network/users.js';

export default {
  name: "users",
  data() {
    //校验邮箱规则  !!! 都是放在 return 外面的额
    var checkemail = (rule,value,cb) => {
      // 验证邮箱的正则表达式
      const regeamil = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regeamil.test(value)){
        return cb()
      }
      cb(new Error('请输入正确的邮箱'))
    }
    //校验手机号规则 !!! 都是放在 return 外面的额
    var checkmobile = (rule,value,cd) =>{
     // 验证手机号的正则表达式
     const regmobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57]|)[0-9]{8}$/
    if(regmobile.test(value)){
      return cd()
    }
     cd(new Error('请输入正确的手机号'))
    }


    return {
      params: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      UsersList: null,
      total: 0,
      isdialogshow: false,
      IsEditDialogShow:false,
      // 添加用户表单数据
      addusers:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      // 查询到的用户信息对象
      editForm:{},

      // 表单验证 
      form1rules:{
         username: [ 
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
         password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min:6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
         email: [ 
            { required: true, message: '请输入邮箱', trigger: 'blur' },
           /*  { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' },
            { validator: checkemail ,trigger: ['blur','change'] } */
          ],
         mobile: [ 
            { required: true, message: '请输入手机号', trigger: 'blur' },
            /* { type:'number',message:'手机号必须为数字', trigger: 'blur' }, */
            { validator: checkmobile , trigger: ['blur','change'] }
          ],
      },
      form2rules:{
        email:[{ required: true, message: '请输入邮箱', trigger: 'blur' },
               { validator: checkemail ,trigger: ['blur','change'] }],
        mobile:[ { required: true, message: '请输入手机号', trigger: 'blur' },
               { validator: checkmobile , trigger: ['blur','change'] }],
        
      }
    };

  },
  props: {},
  components: {},
  created() {
    this.GetUsersList();
  },
  mounted() {},
  methods: {
    async GetUsersList() {
      const { data: res } = await aGetUsersList(this.params);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败!");
      this.UsersList = res.data.users;
      this.total = res.data.total;
    },
    handleCurrentChange(newpagenum) {
      // 页面一变就触发此事件，将默认传入的新页面的值赋值给 params对象;然后再根据此对象重新↑请求数据

      console.log(`当前页: ${newpagenum}`); // ``模板字符串 ${这里面可放入任意表达式，变量名，可运算，对象属性，可调用函数例aaa() }
      this.params.pagenum = newpagenum;               // 括号中值必须为字符串，如果不是默认调用toString方法转成字符串
                                                            //可当普通字符串使用，空格，缩进 解析式会保留
      this.GetUsersList(); // 将新的params对象作为参数 重新发送get请求 。 因为在此页面重新封装了请求函数，因此直接调用就是了 。
    },

    handleSizeChange(newpagesize) {
      // 每页显示几条数据(下拉框) 一变就触发此事件，将默认传入的页面重新显示的值赋值给 params对象;然后再根据此对象重新↑请求数据
      console.log(newpagesize);
      this.params.pagesize = newpagesize;
      this.GetUsersList(); // 将新的params对象作为参数 重新发送get请求 。 因为在此页面重新封装了请求函数，因此直接调用就是了 。
    },

    //监听switch按钮 状态变化事件
    async switchChange(a) {
      //在行间句柄传入的是整个数据对象 scope.row
      console.log(a);
      const { data: res } = await aUserStatechange(a); //状态改变时，发送请求到数据库改变数据
      if (res.meta.status !== 200) {
        a.mg_state = !a.mg_state;
        this.$message.error("改变用户状态失败");
      }
      // 服务器改变失败时，页面的按钮也变回原样
      this.$message.success("改变用户状态成功");
    },

    // 监听 添加用户 对话框的关闭事件     Dialog 对话框一关闭 回调函数 清空表单
    resetform1(){
      this.$refs.form1.resetFields()
    },

    // 监听 修改用户 对话框的关闭事件  这里主要重置验证信息。表单数据每次打开都重新请求最新的
    resetform2(){
      this.$refs.form2.resetFields()
    },

    // 点击确定按钮，添加新用户 
    setusers(){
      this.$refs.form1.validate(  async vaild=>{
          if(!vaild) return this.$message.error('请输入正确的信息');
         // 添加用户的网络请求
      const {data : res} = await aSetNewUsers(this.addusers)
      console.log(res);
         if(res.meta.status !== 201) return this.$message.error('添加用户失败');
         this.$message.success('添加用户成功')
         this.isdialogshow = false;
         this.GetUsersList()
      })
    },

    // 展示 编辑用户 的对话框
  async showEditDialog(id){  //通过作用域插槽传入的数据对象的id属性值
      this.IsEditDialogShow = true;
      //拿到id之后重新请求数据
      const {data : res} =  await aEditUsers(id)
      if(res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editForm = res.data 
    },
    // 点击确定按钮，修改用户信息 并提交
    setEditusers(){
      this.$refs.form2.validate(  async vaild=>{
          if(!vaild) return this.$message.error('请输入正确的信息');
         // 发起修改用户的网络请求
      const {data : res} = await aSetEditUsers(this.editForm)
      console.log(res);
         if(res.meta.status !== 200) return this.$message.error('修改用户信息失败');
         this.$message.success('修改用户信息成功')
         this.IsEditDialogShow = false;
         this.GetUsersList()
      })
    },
    // 根据id删除对应的用户 信息
  async  removeUserByID(id){
         console.log(id);
         // 弹框询问用户是否删除数据  this.$confirm 返回的是promise对象
      const confirmReslt  =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(res => res)  // 必须要写catch不然 取消之后 无法捕获下一步
        // 点确定此promise对象返回 字符串 confirm, 取消为cancel
        if(confirmReslt !== 'confirm'){
          return this.$message({
            type:'info',
            message:'已取消删除'
          })
        };
      const {data:res} = await aDeleteUser(id)
      if(res.meta.status !== 200) this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.GetUsersList()
    }
  },
};
</script>

<style scope>
</style>