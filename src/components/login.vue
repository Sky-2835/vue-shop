<template>
  <div class="login" style="background:#2b4b6b; height:100%" >
     <div class="header">
     <div class="box1"><img src="../assets/logo.png" alt="error"></div>
    <div class="loginbox">
     <!-- <label><input  type="text" placeholder="请输入用户名" v-model.lazy="input1"></label>
     <label><input  type="password" placeholder="请输入密码" v-model.lazy="input2"></label> -->
     <el-form ref="form1"  label-width="80px" :rules="rules" :model='formlogin'>
         <el-form-item label="用户名" prop="username"><!-- rules表单验证对象里的属性名  必须与input框对应-->
         <el-input placeholder="请输入用户名" prefix-icon="el-icon-user-solid" v-model="formlogin.username"> </el-input> 
         </el-form-item>
            <el-form-item label="密码" prop="password"> 
            <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="formlogin.password" show-password></el-input>
            </el-form-item>
    </el-form>
    <el-button type="primary" @click="btnlogin">提交</el-button> <el-button @click="btnclear()">重置</el-button>
    </div>
  </div>


  <h2>{{'用户名: ' + formlogin.username}}</h2> 
  <h2>{{'密码: ' + formlogin.password}}</h2> 


  <div class="block">
    <span class="demonstration">这是我的轮播图</span>
    <el-carousel height="300px" direction="vertical" >
      <el-carousel-item v-for="(item,index) in imgdata" :key="index">
        <img :src="item" alt="肿么了">
      </el-carousel-item> 
    </el-carousel> 
    </div>
  </div>
  
</template>

<script>
import {aSetLoginData} from 'network/Login.js'

export default {
  data() {
    return {//登陆表单数据绑定对象
      formlogin: {
          username: "admin",
          password:'123456'
      },
     /*  info:{
        name:'sky',
        age:18,
      }, */

      rules:{//表单的验证规则对象  会直接在输入框下面显示文字
        username: [ //验证用户名是否合法
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        password:[//验证密码是否合法
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min:6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      
      imgdata:[require('../../../vuecli4test/img/1.jpg'),require('../../../vuecli4test/img/2.jpg'),require('../../../vuecli4test/img/4.jpg'),require('../../../vuecli4test/img/4.jpg'),require('../../../vuecli4test/img/5.jpg')],
     /*  img:'@/assets/logo.png' */
    };
  },
  methods: {
    /* btnclear(){
      this.formlogin.name = '';
      this.formlogin.password = '';
    } ,*/
       btnclear(){
        this.$refs.form1.resetFields() //选择整个表单将数据重置为初始并移除校验结果
       },

       btnlogin(){       //登陆前表单数据的预验证   第一个回调函数 参数valid为校验结果(布尔值)与自己设置的表单验证规则比对 验证成功为true      
          this.$refs.form1.validate( async valid=>{
            /* console.log(valid); */ 
            if(!valid) return;    // 当表单验证通过时，POST上传数据      !!!设置了响应拦截 这里响应失败也只会走.then
             /*  aSetLoginData()                                      .then(res=>{console.log(res);}).catch(err=>{console.log(err);}) */
             const { data : res } = await aSetLoginData(this.formlogin)   // async后 await会直接拿到后面promise对象的返回值即传入.then里的实参res 传入.catch里的实参err
             //将响应成功传来的数据里的data对象 解构赋值给 res 
              //假入返回 200状态码 则登陆成功
             console.log(res);   
                                          // 弹框消息
             if(res.meta.status !== 200 ){/* window.alert('登录失败')}else{window.alert('登陆成功') */
                                        this.$message({         
                                          type:'error',
                                          showClose:'true',
                                          message:'登录失败'//VUE3 E-PIUS自动全局挂载. 所以只可在 methods内 直接使用 this.$message
                                                           //VUE3 在其他地方使用还是要与其他一样在element.js导入注册//
                                        });
                                                                               
                                        }else{           //VUE2则是在element.js导入然后不同的是需要挂载 Vue.prototype.$message = message  
                                        this.$message({                                  //  其他↑是注册 例: Vue.ues(Button)
                                           type:'success',   //VUe2 这样使用this.$message.error('登录失败') 
                                           message:'登陆成功' //   this.$message('这是一条消息提示');
                                         });
                     /*  将token口令保存在浏览器sessionStorage内 。其他api接口(页面)必须在带有token口令才能访问，只应该在当前网址打开期间有效，
                                              关闭就清除，所以不放在Localstorage内                                                     */
                                         window.sessionStorage.setItem('token',res.data.token)  
                                         console.log(res.data.token);
                                         this.$router.push({path:'/home',query:{}}) //跳转到home的welcome子页面           

             }                   
            }
          )
      },
     created(){
       console.log('我还能继续使用');
      /*  instance1({
         url:'/home/multidata',
       }).then(res=>console.log(res)).catch(err=>console.log(err)) */
     },
     mounted(){
       console.log(this.info);
     }
} 
}    
    

</script>

<style  scoped>

.header {
  padding-top: 80px;;
}
.box1 {
  position: absolute;
  height: 100px;
  width: 100px;
  left: 50%;
  top: -10px;
  transform: translate(-58%, 21%);
}
.box1 img{
  background-color: #eee;
  width: 100%;
  position: absolute;
  border: 10px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
}
.loginbox {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  width: 395px;
  height: 300px;
  margin: 10px auto;
  background-color: #fff;
}
.el-input{
  width: 90%;
  margin: 3px 20px;
  padding: 0 0px;
}
.el-input__prefix{
    left: 44px;
}


/* input {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 300px;
  font-family: inherit;
  text-rendering: auto;
  color: -internal-light-dark(black, white);
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  appearance: auto;
  background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
  -webkit-rtl-ordering: logical;
  cursor: text;
  margin: 0em;
  font: 400 13.3333px Arial;
  margin: 2px 0;
} */
.el-button {
  margin-top: 10px;
  transform: translateX(73px);
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
  
  .block img{
    width: 100%;
    height: 100%;
  }
</style>