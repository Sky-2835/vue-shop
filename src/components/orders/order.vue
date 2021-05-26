<template>
    <div>
        <bc>
            <span slot='x'>订单管理</span>
            <span slot="y">订单列表</span>
        </bc>

        <el-card>

           <el-input placeholder="请输入内容" v-model="params.query" clearable @input="editInput" :key="1" class="input1">
                <el-button slot="append" icon="el-icon-search" @click="getOrderDate"></el-button>
           </el-input>

            <el-table :data="tableOrderData" border style="width: 100%">
              <el-table-column  type='index' label='#'></el-table-column>
              <el-table-column  label='订单编号' prop='order_number' ></el-table-column>
              <el-table-column  label='订单价格' prop='order_price'  align='center'></el-table-column>
              <el-table-column  label='是否付款' prop='pay_status' align='center' >
                  <template v-slot:default='scope'>
                      <el-tag type='success' v-if='scope.row.order_pay === "1" '>已付款</el-tag>
                      <el-tag type='danger' v-else>未付款</el-tag>
                  </template>
              </el-table-column>
              <el-table-column  label='是否发货' prop='is_send' align='center' ></el-table-column>
              <el-table-column  label='下单时间' align='center'>
                  <template v-slot:default= 'scope'>
                     <span>{{scope.row.create_time | dateFormat}}</span>
                  </template>
              </el-table-column>
              <el-table-column  label='操作'>
                  <template v-slot:default='scope'>
                      <el-button type="primary" icon="el-icon-edit" size='small' @click="editOrder(scope.row.order_id)"></el-button>
                        <el-button type="success" icon='el-icon-location-outline' size='small' @click="showProgressBox(scope.row.order_id)"></el-button>
                  </template>
              </el-table-column>
            </el-table>

            <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="params.pagenum"
               :page-sizes="[10, 20, 30, 40]"
               :page-size="params.pagesize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
            </el-pagination>
        </el-card>

    <!--   <el-dialog title="修改订单" :visible.sync="isOrderDialogShow" width="40%"  @close='OrderDialogColse'>

           <el-form :model="orderDate" :rules="orderRules" ref="orderRulesForm" label-width="100px" >
              <el-form-item label="是否发货">
                  switch组件 v-model绑定的值会变成布尔值。例:原来可能是 0,1,'1','0' 最后都变成 false true 
                 <el-switch v-model="orderDate.is_send" ></el-switch>
              </el-form-item>
              <el-form-item label="订单价格" prop="order_price">
                <el-input v-model.number="orderDate.order_price"></el-input> @change="getValue"
              </el-form-item>
              <el-form-item label="订单编号" prop="order_number">
                <el-input v-model="orderDate.order_number" ></el-input>
              </el-form-item>
              <el-form-item label="商品总价" prop="goods_price">
                <el-input v-model="orderDate.goods_price"></el-input>
              </el-form-item>
           </el-form>

           <span slot="footer" class="dialog-footer">
             <el-button @click="isOrderDialogShow = false">取 消</el-button>
             <el-button type="primary" @click="isOrderDialogShow = false">确 定</el-button>
           </span>
         </el-dialog>    -->

        <el-dialog title="修改地址" :visible.sync="isOrderDialogShow" width="40%"  @close='OrderDialogColse'>

           <el-form :model="orderDate" :rules="orderRules" ref="orderRulesForm" label-width="100px" >
               <el-form-item label="省市区/县" prop="address1">
                 <el-cascader v-model="orderDate.address1" :options="cityData" :props="cascaderConfig"  @change="handleChange" clearable></el-cascader>
              </el-form-item>
               <el-form-item label="详细地址" prop="address2">
                 <el-input v-model="orderDate.address2"></el-input>
              </el-form-item>
           </el-form>   
        
           <span slot="footer" class="dialog-footer">
             <el-button @click="isOrderDialogShow = false">取 消</el-button>
             <el-button type="primary" @click="isOrderDialogShow = false">确 定</el-button>
           </span>
        </el-dialog>  

        <el-dialog title="物流信息" :visible.sync="isProgressBoxShow" width="40%" >
            <el-timeline :reverse="false">
              <el-timeline-item
                v-for="(activity, index) in progressInfo"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
              </el-timeline-item>
            </el-timeline>
        </el-dialog>  
    </div>
</template>


<script>
import cityData from './cityData.js'
import aaa      from './progressInfo.json'

export default{
    data(){
      return{
         //订单列表 请求参数
         params:{
             query:"",
             pagenum:1,
             pagesize:10,
         },

         //订单列表 数据
         tableOrderData:[],

         //总条数
         total:0,

         //搜索框 数据
         input1:'',
         
    /*   //是否显示编辑订单 对话框
         isOrderDialogShow:false,

         // 订单详情 数据 Form表单
         orderDate:{},

         // form表单 验证规则
         orderRules:{
             order_number:[{
                required: true, message: '请输入订单编号', trigger: 'blur' 
             },],
             order_price:[{
                 required:true, message: '请输入订单价格', trigger: 'blur' 
             },
             ],
             goods_price:[{
                 required:true, message: '请输入商品总价', trigger: 'blur' 
             }],
         } */

          //是否显示编辑订单 对话框
         isOrderDialogShow:false,

         // 修改地址 Form表单
         orderDate:{
             // 级联选择 数据
             address1:[],
             address2:'',
         },

         // 级联配置 对象
         cascaderConfig:{
             expandTrigger: 'hover',
             value:'value',
             label:'label',
             children:'children',
         },
         
         // 级联渲染数据
         cityData,

         // form表单 验证规则
         orderRules:{
             address1:[{
                required: true, message: '请选择省市区/县', trigger: 'blur' 
             },],
             address2:[{
                 required:true, message: '请填写详细地址', trigger: 'blur' 
             },]
         },

         // 是否显示物流信息框
         isProgressBoxShow:false,

         //物流信息 对象
         progressInfo:aaa.data,
      }
    },
    methods:{
        // 获取所有订单列表数据
async getOrderDate(){
        const {data : res }  = await this.$axios.get(`orders`,{params:this.params})
        if(res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.tableOrderData = res.data.goods
        this.total = res.data.total
        },
        
        /* 要想点击按钮在搜索，不用这个事件 @clear='getOrderDate'  直接执行请求数据函数*/
        // 输入框数据变化  
        editInput(){
           this.getOrderDate()
        },
     
        // 页面显示条数变化
        handleSizeChange(newSize){
            console.log(newSize);
            this.params.pagesize = newSize
            this.getOrderDate()
        },

        // 页数变化
        handleCurrentChange(newNum){
            console.log(newNum);
            this.params.pagenum = newNum
            this.getOrderDate()
        },

/*      // 编辑订单按钮
   async editOrder(order_id){
            console.log(order_id);
            this.isOrderDialogShow = true
         const {data : res} = await this.$axios.get(`orders/${order_id}`)
         if(res.meta.status !== 200) return this.$message.error('获取订单消息失败')
        //计算出的订单内所有商品的总价格。可能用不上，订单价格就行了
         res.data.goods_price = res.data.goods.reduce((i,item)=>{
             return i + item.goods_price
         },0).toFixed(2) + '元'
         // switch绑定的值
         if(res.data.is_send === '否'){
             res.data.is_send = false
         }else{
              res.data.is_send = true
         }
         
         res.data.order_price = res.data.order_price.toFixed(2) + '元'

         this.orderDate = res.data
        },

        // 编辑Dialog面板关闭时 
        OrderDialogColse(){
           //清空表单的校验信息
           this.$refs.orderRulesForm.clearValidate()
        },
        
        // 设定input框的输出格式 
        getValue(){
            this.orderDate.order_price =this.orderDate.order_price.toFixed(2) + '元'
            console.log(this.orderDate.order_price); 
        }   */
   
   
        // 编辑订单(修改路径)按钮。。没写接口不能改路径，此函数仅仅打开了对话框。。。。。
        async editOrder(order_id){
            console.log(order_id);
            this.isOrderDialogShow = true
         const {data : res} = await this.$axios.get(`orders/${order_id}`)
         if(res.meta.status !== 200) return this.$message.error('获取订单消息失败')
        },
        
        // 编辑Dialog面板关闭时 
        OrderDialogColse(){
           /* 清空表单的校验信息
           this.$refs.orderRulesForm.clearValidate() */

           //清空表单
           this.$refs.orderRulesForm.resetFields()

        },

        //级联数据变化
        handleChange(a){
            console.log(a);
        },

        //打开物流信息对话框
 async showProgressBox(id){
          this.isProgressBoxShow = true
        /* 接口蹦了 另外从progressInfo.JSON文件导入对象
        const {data : res} = await this.$axios.get(`/kuaidi/1106975712662`)
         if(res.meta.status !== 200) return this.$message.error('获取物流信息失败')
         this.$message.success('获取物流信息成功')
         this.progressInfo = res.data */
        } 
},
    created(){
        this.getOrderDate()
    },
}

</script>

<style lang="less" scoped>
.input1{
    width: 40%;
}
</style>