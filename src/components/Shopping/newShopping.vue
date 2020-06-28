<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/shopping' }">商城中心</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/shopping/newshopping' }">商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :rules="addFormRules" ref="addformRef" :model="addForm" >
      <el-form-item label="所属分类" label-width="100px" prop="categoryId">
        <el-select v-model="addForm.categoryId" placeholder="请选择">
          <el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" label-width="100px" prop="name">
        <el-input v-model="addForm.name"></el-input>
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
        <el-input v-model="addForm.price"></el-input>
      </el-form-item>

      <el-form-item label="条形码" label-width="100px" prop="code">
        <el-input v-model="addForm.code"></el-input>
      </el-form-item>

      <el-form-item label="库存" label-width="100px" prop="stock">
        <el-input v-model="addForm.stock"></el-input>
      </el-form-item>

       <el-form-item label="已售" label-width="100px" prop="sale">
        <el-input v-model="addForm.sale"></el-input>
      </el-form-item>
        <el-form-item label="商品描述" label-width="100px">
                <vue-simplemde preview-class="markdown-body" v-model="addForm.body" />
        </el-form-item>
    </el-form>
   <el-button type="success" @click="addbtn" class="addbtn">提交</el-button>
   <el-button type="success" @click="resetbtn" class="resetbtn">重置</el-button>
  </div>
</template>

<script>
import VueSimplemde from 'vue-simplemde'
import { v4 as uuidv4 } from 'uuid';
export default {
  data() {
    return {
      category: [],
       addForm: {
          categoryId: '',
          name: '',
          image: '',
          price: '',
          code: '',
          stock: '',
          sale: '',
          categoryId:'',
          body:''
        },
        qiniu:{
            key:'',
            token:''
        },
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
      }
    };
  },
  components: {
      VueSimplemde
    },
  created() {
      this.getClass()
  },
  methods: {
      async getClass(){
          const res = await this.axios.get('/admin/category')
         this.category = res.data.category
    },
    // 提交
    addbtn(){
        this.$refs.addformRef.validate(async valid=>{
            if(!valid) return;
             const res = await this.axios.post('/admin/product',this.addForm)
            //  console.log(res);
             
            if(res.data.msg ==='此条形码已经存在'){
               return this.$message.error('此条形码已经存在')
            }
            this.$router.push({name:'shopping'})
            this.$message.success('新增成功')
        })
    },
    // 重置
    resetbtn(){
        this.$refs.addformRef.resetFields();
    },
    // 图片上传规则
   async beforeAvatarUpload(file){
        // console.log(file);
        const isJPG = file.type==='image/jpeg'
        const isPNG = file.type==='image/png'
        const isLt2M = file.size / 1024 / 1024 < 4
        if(!isJPG &&!isPNG){
            this.$message.error('图片只能上传格式只能是 JPG, PNG,GIF')
        }
        if(!isLt2M){
            this.$message.error('上传的图片不能超过2MB')
        }
        // 取图片的后缀名
        let hz = file.type==='image/jpeg'?'.jpg':'.png'
            const res = await this.axios.get('/admin/photos/uploadToken');// 请求七牛网
            console.log(res);
            
            this.qiniu={
                key:uuidv4()+hz,
                token:res.data.data.token
            }
        return true
    },
    handleAvatarSuccess(val){
        this.addForm.image = 'http://qc1yb7690.bkt.clouddn.com/' + val.key
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~simplemde/dist/simplemde.min.css';
.bread {
  padding: 20px 0;
  border-bottom: 1px #ccc solid;
}
.addbtn{
    margin-left: 80px;
}
.el-form-item__content{
  width: 100%;
}
</style>