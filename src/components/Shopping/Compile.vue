<template>
  <div>
       <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/shopping' }">商城中心</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/shopping/newshopping' }">商品管理</el-breadcrumb-item>
    </el-breadcrumb>

        <el-form :rules="eddFormRules" ref="eddformRef" :model="eddForm" >
      <el-form-item label="所属分类" label-width="100px" prop="categoryId">
        <el-select v-model="eddForm.categoryId" placeholder="请选择">
          <el-option v-for="item in category" 
          :key="item.id" 
          :label="item.name" 
          :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" label-width="100px" prop="name">
        <el-input v-model="eddForm.name"></el-input>
      </el-form-item>
      <el-form-item label="缩略图" label-width="100px" prop="image">
        <el-upload
          class="upload-demo"
          drag
          action="http://upload.qiniup.com"
          multiple
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :data="qiniu"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="单价" label-width="100px" prop="price">
        <el-input v-model="eddForm.price"></el-input>
      </el-form-item>

      <el-form-item label="条形码" label-width="100px" prop="code">
        <el-input v-model="eddForm.code"></el-input>
      </el-form-item>

      <el-form-item label="库存" label-width="100px" prop="stock">
        <el-input v-model="eddForm.stock" width="100px"></el-input>
      </el-form-item>

       <el-form-item label="已售" label-width="100px" prop="sale">
        <el-input v-model="eddForm.sale"></el-input>
      </el-form-item>
        <el-form-item label="商品描述" label-width="100px">
                <vue-simplemde preview-class="markdown-body" v-model="eddForm.body" />
        </el-form-item>
           <el-button type="success" @click="eddbtn(eddForm.id)" class="addbtn">提交</el-button>
            <el-button type="success" @click="resetbtn" class="resetbtn">重置</el-button>
    </el-form>
  </div>
</template>

<script>
import VueSimplemde from 'vue-simplemde'
import { v4 as uuidv4 } from 'uuid';
export default {
    data(){
        return{
        addFormRules:{
          name:[
               { required: true, message: '请输入商品名称', trigger: 'blur' },
               { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          price:[
               { required: true, message: '请输入商品价格', trigger: 'blur' },
               { min: 1, max:25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          code:[
                { required: true, message: '请输入条形码', trigger: 'blur' },
               { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          stock:[
                { required: true, message: '请输入库存的数量', trigger: 'blur' },
               { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          sale:[
                { required: true, message: '请输入已售的数量', trigger: 'blur' },
               { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          categoryId:[
                { required: true, message: '请选择分类', trigger: 'blur' },
          ],
      },
        eddForm:{},
        category:[],
        qiniu:{
            key:'',
            token:''
        },
        }
    },
       components: {
          VueSimplemde
    },
    created(){
        this.getinfo()
        let id = this.$route.params.id
        this.axios.get('admin/product/'+id).then((res)=>{
            this.eddForm = res.data.Product
            console.log(res.data.Product);
          this.eddForm.body =  this.eddForm.body == null?'':res.data.Product.body
        })
    },
    methods:{
       async getinfo(){
            const res = await this.axios.get('/admin/category')
            this.category = res.data.category
        },
        // 图片验证
      async  beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const isLt2M = file.size / 1023 / 1024 < 4
            if(!isJPG && !isPNG){
                this.$message.error('只能上传jpg 或者 png格式的图片')
            }
            if(!isLt2M){
                this.$message.error('最大只能上传 2MB')
            }
            let hz = file.type ==='image/jpeg'?'.jpg':'.png'
            const res = await this.axios.get('/admin/photos/uploadToken');// 请求七牛网
            console.log(res);
            this.qiniu={
                key:uuidv4()+hz,
                token:res.data.data.token
            }
            return true
        },
        // 拼接图片
        handleAvatarSuccess(val){
            this.eddForm.image = 'http://qc1yb7690.bkt.clouddn.com/' + val.key
        },
        // 提交
        async eddbtn(id){
            this.$refs.eddformRef.validate(async valid=>{
                if(!valid) return;
            })
          const res = await this.axios.put(`/admin/product/${id}`,this.eddForm)
          console.log(res);
          
            this.$router.go(-1)
            this.$message.success('修改成功')
        },
        resetbtn(){}
    }
}
</script>

<style lang="scss" scoped>
.bread {
  padding: 20px 0;
  border-bottom: 1px #ccc solid;
}

.form{
    margin: 20px 0px;
}
.span1{
    line-height: 40px;
    margin:0px 10px 0px 20px;
}
.btn{
    margin-left: 20px;
}
.el-form-item__content{
  width: 50%;
}
</style>