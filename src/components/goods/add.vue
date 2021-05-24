<template>
  <div >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item >添加商品</el-breadcrumb-item>
    </el-breadcrumb>
     <el-card class="card">
       <el-alert title="添加商品信息" type="info" center show-icon :closable='false'></el-alert>

       <el-steps :active="activeName - 0" finish-status="success" align-center><!-- 这里直接将activeName转化为数字，形成联动 !!! 虽然可以直接 -acactiveName转化成数字-0，-1，-2，但容易出BUG 还是减0好 -->
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
       </el-steps>

      <!-- 因为el-tab的儿子组件只能为el-tab-pane; 所以想要每个标签页内的 el-form-item 都是同一个Form表单的子组件。只能用Form表单包裹整个el-tabs组件-->
    <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsForm" label-width="100px" label-position="top" class="form">
      <el-tabs v-model="activeName" @tab-click="handleTabClick" tabPosition='left' :before-leave='changeTabs'>
                                                                              <!-- ↑切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject(例: return promise.reject()   )，则阻止切换。 默认传参 1要到的标签activeName 2当前activeName-->
        <el-tab-pane label="基本信息" name="0">
             <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addGoodsForm.goods_name"></el-input>
             </el-form-item>
             <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addGoodsForm.goods_price" type='number' ></el-input>
             </el-form-item>
             <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addGoodsForm.goods_weight" type='number'></el-input>
             </el-form-item>
             <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addGoodsForm.goods_number" type='number'></el-input>
             </el-form-item>
             <el-form-item label="商品分类(只能选择三级分类)" prop="goods_cat"> <!-- 写了校验规则，Form表单也无法校验级联选择器；只是为了在 label前面加上 * 号 -->
                  <el-cascader v-model="addGoodsForm.goods_cat" :options="allCateDate" :props="cascaderConfig2" @change="cascaderChange2" clearable></el-cascader>
             </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
            <!-- 为了保证用同一个 整个Form表单 多选框也要被 el-form-item 包裹-->
            <el-form-item :label='item.attr_name' v-for="item in manyData" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                   <el-checkbox :label="itemson" v-for="(itemson,index) in item.attr_vals" :key="index"  border></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for='item in onlyData' :key="item.attr_id">
                <el-input v-model="item.attr_vals" ></el-input>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3" class="pane">
          <!-- 上传文件  ！！！这个组件不会使用axios发送请求，会使用自己封装的AJAX请求 所以一定要要先单独配置 请求头对象 再发送请求 -->
          <el-upload
             :headers='headersObj'
             :action="baseUrl + 'upload'"
             :on-preview="handlePreview"
             :on-remove="handleRemove"
             :on-progress='uploading'
             :on-success ='issuccess'
             :on-error='errorInfo'
             list-type="picture"
             multiple
             :auto-upload="!isShowUpLoadBtn"
             ref='upload'
             >
             <!-- 必须手动添加请求头对象 -->
             <!-- action 为 要上传到的服务器地址，要写全；已经给Vue原型对象设置了$baseUrl属性；所以这里能动态给它添加; uers => 当前页面 + users  ;  /users=>跟路径  -->
             <!-- 点击文件列表中(已上传 在列表中的文件 不一定都上传成功了)的文件时的钩子 -->
             <!-- 点× 删除文件列表中文件时     触发回调函数-->
             <!-- 上传时 ，上传成功，上传失败 3种回调函数 -->
             <!-- 文件列表显示形式 -->
             <!-- !!!! 开启多选，也只是依次排队上传选中的文件(重复发送post请求)  所以会根据文件 依次(单独) 执行这些函数 -->
             <!-- false时取消自动上传  点击了开始上传 只是显示为文件列表 还没上传 -->
             <!-- 根据ref选中此组件.submit()  手动上传 ;设为自动上传时，此方法无效无反应-->
             <el-button size="small" type="primary">点击上传</el-button>
             <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                                   <!-- 可以上传超过的，只是慢。可以↑写上这要求 -->
           </el-upload>
          <!--  <el-row type="flex" justify="end" 垃圾 直接下面↓>
             <el-col :span='4' >
                <el-button type='primary' icon='el-icon-upload el-icon--right' size='small' @click="btnclick" >确认上传</el-button>
             </el-col>
           </el-row> -->
           <div class="box" v-show="isShowUpLoadBtn">
              <el-button type='primary' icon='el-icon-upload el-icon--right' size='small' @click="btnclick" >确认上传</el-button>
           </div>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">  <!-- 富文本内添加的数据:以字符串保存出来  "<p> innerHtml </p> " -->
                                                                      <!-- 例: 文本"<p> 123你好，我是文本</p>" -->
                                                                      <!--     图片"<p> <img src='base64字符串'></p> "  -->
            <quill-editor ref="myQuillEditor" v-model="addGoodsForm.goods_introduce" />
            <el-button type='primary' class="addBtn" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
     </el-card>

     <!-- 预览图片 弹出的对话框 -->
        <el-dialog title="图片预览" :visible.sync="isDialogShow" width="30%">
                <img :src="imgSrc" alt="加载失败" style='width:100%'> 
        </el-dialog>
  </div>
</template>

<script>

export default {
  data() { 
    // 自定义 商品价格 验证
    var checkAge = (rule, value, callback) => {
        if (value == '0') {
          return callback(new Error('价格不能为0'));
        }
        if(value<0){
          return callback(new Error('价格不能为负'))
        }
        callback()
    }

    // 自定义 商品数量 验证
    var checkAge1 = (rule, value, callback) => {
        if(!value || !(value > 0)){
            return callback(new Error('商品数量不能小于等于0'))
        }
        callback()
    }

    return {
      //当前显示步骤几 简便步骤直接使用下面这个值
      stepsNum:0,

      //tab标签显示谁
      activeName:'0',

      //Form表单 绑定数据
      addGoodsForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        //级联选中的数据 id  商品分类信息
        goods_cat:[],

        /* (依次)上传的图片,服务器响应回来的 图片在服务器中的地址信息组成的数组。通过upLoad的on-success钩子函数赋值；一张图片在数组中一个对象 
        例:  {tmp_path: "tmp_uploads/ccfc5179a914e94506bcbb7377e8985f.png"},{}，{}
        */ 
        pics:[],

        // 富文本编辑器编辑的 商品信息
        goods_introduce:'',

        //商品属性 跟 参数 
        attrs:[],
      },

      //Form表单 验证规则 对象
      addGoodsFormRules:{
        goods_name:[
           { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
        goods_price:[
           { required: true, message: '请输入商品价格', trigger: 'blur' },
           {validator:checkAge,trigger: 'blur'}
          ],  
        goods_weight:[
           { required: true, message: '请输入商品重量', trigger: 'blur' },
          ], 
        goods_number:[
           { required: true, message: '请输入商品数量', trigger: 'blur' },
           {
             validator:checkAge1,trigger: 'blur'
           },
          ], 
        goods_cat:[
          {required: true, message: '请选择商品分类', trigger: 'blur'}
        ]   
      },
      
      // 级联 绑定数据 必须数组.这里直接绑定了From数据的一个对象，所以用不上了.可以中转用，级联必须绑定为数组，如果直接将数据处理成字符串。将报错，所以中转用
          
      selectedGrandsonKeys:[],

      // 级联 渲染数据 数组嵌对象
      allCateDate:[],
      
      //级联配置参数 对象
      cascaderConfig2:{
        expandTrigger:'hover',
        checkStrictly:false,
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
         
    /*   自己想的 当公用变量 依次校验名称 ，价格
      format:'', */
       
      // 动态属性 数据   一个属性/参数=>数组中的一个对象
      manyData:[],
      
      // 静态参数 数据
      onlyData:[],

      // 上传地址的 baseurl
      baseUrl:'',

      // 上传发起post请求时 的 请求头 对象
      headersObj:{
        Authorization: window.sessionStorage.getItem('token')
      },

      // 是否显示图片预览 弹出框
      isDialogShow:false,

      // 预览图片的地址;上传成功时 服务器响应回来一个src地址
      imgSrc:"",

      // 是否显示 手动上传按钮 
      isShowUpLoadBtn:false,

      // 自己设置的计数变量 是否点击了 商品参数标签
      isClickMany:false,
      // 自己设置的计数变量 是否点击了 商品属性标签
      isClickOnly:false,
    }
  },
  props: {

  },
  components:{
  },
  created(){
    this.gerAllCate()
    //获取上传地址的 baseurl
    this.baseUrl = this.$baseURL;
  },
  mounted() {

  },
  methods:{
     // 获取所有商品分类信息
async gerAllCate(){
        const {data : res} = await this.$axios.get(`categories`)
        if(res.meta.status !== 200) return this.$message.error('获取商品分类信息失败')
        this.allCateDate = res.data
     },
     
     // 点击任意tab标签 回调函数  默认传入选中的Tab标签！！组件！！实例，事件对象
async handleTabClick(){ 
        // 点击商品参数标签，并且 确定切换 到了对应面板   即 activeName = '1' 根据级联选中的ID请求来对应的动态参数
        if(this.activeName === '1'){
          const { data : res } = await this.$axios.get(`categories/${this.getID}/attributes`,{params:{sel:'many'}})
          if(res.meta.status !== 200) return this.$message.error('获取动态参数失败')
          // 遍历，将每个属性的 子属性从字符串 切成数组
          res.data.forEach(item=>{
          item.attr_vals = (item.attr_vals.length === 0 ) ? [] : item.attr_vals.split(',')
          }) 
          this.manyData = res.data
          console.log(this.manyData);
          this.isClickMany = 1
        }
        
        // 点击商品属性标签 请求静态属性
        if(this.activeName === '2'){
          const { data : res } = await this.$axios.get(`categories/${this.getID}/attributes`,{params:{sel:'only'}})
          if(res.meta.status !== 200) return this.$message.error('获取动态参数失败')
          console.log(res.data);
         /*  res.data.forEach(item=>{
          item.attr_vals = (item.attr_vals.length === 0) ? [] : item.attr_vals.split(',')
          }) */
          this.onlyData = res.data
          this.isClickOnly = 1
        }
         console.log(this.activeName);
     },

     // 级联  选择的内容一变化就触发 即V-model一变就触发 默认传参 新的选中值
     cascaderChange2(){
        if(this.addGoodsForm.goods_cat.length !== 3){
          this.addGoodsForm.goods_cat = []
        }
        /* ( 点击添加商品后。 重新选择分类后 要清空这两数组，不然不再次点击商品参数、属性tab页面重新赋值对应的值，直接再次点击最后的添加商品，请求参数对象 .attrs是错误的数组)  不需要了、会在点击添加商品后 写上对应代码
        this.onlyData = [],
        this.manyData = [] 
        this.isClickMany = false;
        this.isClickOnly = false; */
     },

     // 切换tabs标签 回调函数；决定是否能切换标签 ；默认传参 1要到的标签activeName 2当前activeName  
     changeTabs(newActiveName,oldActiveName){
       if(oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3 ){
         this.$message.error('请先选择商品分类')
         return false
       }
         
  /*   只验证部分表单 验证完的"错误信息"   默认传入后面回调函数当实参
        自己想的 依次校验 名称 价格; 校验失败 不会切换tabs标签
        this.$refs.addGoodsForm.validateField(['goods_name', 'goods_price'],(a)=>{
         if(a){
           this.$message.error('输入商品名称')
           this.format = false
           return 
         }
            this.$refs.addGoodsForm.validateField('goods_price',a=>{
              if(a){
                this.$message.error('输入商品价格')
                this.format = false
                return 
              }
            })
       })
        return this.format */
      },

      // 点击文件列表中(已上传 不一定↓这种情况也会在文件列表中显示文件)的文件时的钩子 回调函数 默认传参 这个文件对象。  
      handlePreview(a){
        console.log(a);
        this.isDialogShow = true
        /* 
        const url =  a.response.data.url.substr(22)
        this.imgSrc = 'http://www.ysqorz.top:8888/' + url     或者直接↓*/
        this.imgSrc = 'http://www.ysqorz.top:8888/'+a.response.data.tmp_path
        console.log(this.imgSrc);
      },

      // 点× 删除文件列表中文件时   触发回调函数
      handleRemove(file){
      /*  1 直接用filter方法
          this.addGoodsForm.pics = this.addGoodsForm.pics.    filter(item=>{
               return file.response.data.tmp_path !==     item.pic
            }) 2 用findIndex找出位置，再用splice切除 */
           const index = this.addGoodsForm.pics.findIndex((item)=>{
                  return file.response.data.tmp_path === item.pic})  
           this.addGoodsForm.pics.splice(index,1)
      },
      
      // 点击按钮 手动上传
      btnclick(){
        //假如文件列表为空 不上传
         const ul = document.getElementsByClassName('el-upload-list--picture')[0]
         if(window.getComputedStyle(ul).height !== '0px'){
           this.$refs.upload.submit()
         }else{
           return this.$message.error('请点击上传文件')
         }
         
      },
      // !!!! 图片过大 上传慢的时候，它会一直触发这个函数一直弹提示
      uploading(){ 
      //  this.$message.info('正在上传')
        /* 下一轮执行队列，弹出成功上传之后才会弹这个
        setTimeout(()=>{
          this.$message.info('正在上传')
        }, 100)
        setTimeout(()=>{
          this.$message.info('正在努力上传')
        }, 300) */
      },

  /*  !!!  服务器响应返回的对象{data:……  ,  meta:……}它被赋值 给了文件列表中文件对象的response属性 (注意 它跟axios请求返回的对象不同 {data:{data:…… ，meta:……}})
   成功跟失败 取决于文件列表中这个文件对象中的 status属性。
      所以status:"success" 它就认为上传成功了 就会回调 on-success钩子；其实很可能并未真正上传成功。应该看 此文件对象.response.meta.status状态码，它才是服务器的回应        */
      
      issuccess(res,file){    //文件上传成功时 默认传参1服务器响应返回的对象 2文件对象 3文件列表
        this.$message.success("上传成功")
        console.log(res);
        /* let obj = {...res.data}
           delete obj.url
           this.addGoodsForm.pics.push(obj) ↓或者*/
           const obj = {pic:res.data.tmp_path}
           this.addGoodsForm.pics.push(obj)
           console.log(this.addGoodsForm.pics);
           file.name = file.name +'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +'点击图片可以预览'
           
      },
      errorInfo(){
        this.$message.error('上传失败')
      },

      // 最后一步 添加商品 按钮
      add(){
          //先对所有表单进行预验证
          this.$refs.addGoodsForm.validate(async valid=>{
            if(!valid) return this.$message.error('请填写必要的表单项')

          /* 先判断 用户点击了商品属性 跟 参数面板了吗, 如果没点击面板不会发送请求请求来数据，那么最后需要上传的Form对象上"attrs"属性就为空 
          不点击 这2个一定是空数组，但是有可能本身就为空。咋办呢。设置个变量计数*/
            if(!this.manyData.length || !this.onlyData.length){
                if(!this.isClickMany){
                  this.$message.error('请不要跳过商品参数步骤')
                  return
                }
                if(!this.isClickOnly){
                  this.$message.error('请不要跳过商品属性步骤')
                  return
                }
            }
            this.manyData.forEach(item=>{
              const obj = {
                attr_id:item.attr_id,
                attr_value:item.attr_vals.join(','),
              }
              this.addGoodsForm.attrs.push(obj)
            }) 
            this.onlyData.forEach(item=>{
               const obj = {
                 attr_id:item.attr_id,
                 attr_value:item.attr_vals,
               }
               this.addGoodsForm.attrs.push(obj)
            })

          /* 不能直接将这个数组转成字符串再赋值给原数组，因为级联双向绑定的必须是一个数组，变成字符串了 要报错。所以深拷贝整个对象再操作，用作发送请求
            this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(',') */
            const addGoodsForm2 = JSON.parse(JSON.stringify(this.addGoodsForm))
            addGoodsForm2.goods_cat = addGoodsForm2.goods_cat.join(',')
            console.log(111111111111);
            console.log(addGoodsForm2);

         // 发送添加商品的请求 。注意 商品名称要唯一不然会失败
         const {data : res } = await this.$axios.post('goods',addGoodsForm2)
           if(res.meta.status !== 201) return this.$message.error('添加商品失败')
           this.$message.success('添加商品成功')
           this.$router.push('/goods')
          })
      }
  },
  computed:{
    // 获取级联选中的 三级商品分类 ID
    getID(){
       if(this.addGoodsForm.goods_cat.length ===3){
         return this.addGoodsForm.goods_cat[2]
       }
       return null
    }
  }

 }
</script>

<style  scoped>

.el-tabs{
  margin:15px 0 
}

.el-form-item{
  width: 70%;
}

.el-checkbox{
  margin: 0 0 0 10px  !important ;
}

/* .el-row{
    margin-top: 105px;
    width: 80%;
} */

.box{         /* 调按钮的位置  外面套个div flex就完事了 */
  width: 80%;
  display: flex;
  justify-content: flex-end;
  margin-top: 105px;
}

/* .box2{          预览大图时的位置 外面套个div flex就完事了    img标签width:400px;height:400px  。这样不好，页面缩时时,                图片要溢出弹出框。    img标签直接 width:100% 就完事了        
  display: flex;
  justify-content: center;
} */

.addBtn{
  margin-top: 15px;
}
</style>