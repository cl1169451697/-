<template>
  <div>
    <el-row class="row">
      <el-button type="primary" icon="el-icon-edit" @click="dialogTableVisible = true">新增</el-button>
      <el-button type="primary" icon="el-icon-edit">导出</el-button>
    </el-row>

    <!-- 表单 -->
    <el-table class="tables" :data="tableData" style="width: 100%" border stripe>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>
      <el-table-column  label="排序">
        <template slot-scope="scope">
          <el-input class="changeInput"  size="mini" type="text" v-model="scope.row.sort" 
          @change="sort(scope.row.id,scope.row.sort)"></el-input>
          <!-- 排序 -->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" @click="showeddDialog(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增 -->
    <el-dialog 
    title="添加分类" 
    :visible.sync="dialogTableVisible" 
    @close="addDialogClosed" 
    width="60%">
      <el-form 
       :model="addForm"
       label-width="100px" 
       :rules="addFormRules"
        ref="addFormRef">
        <el-form-item label="分类名称:" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类排序:" prop="sort">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClss">确 定</el-button>
      </span>
    </el-dialog>

      <!-- 修改 -->
    <el-dialog 
    title="修改分类" 
    :visible.sync="eddlogTableVisible" 
    @close="eddDialogClosed" 
    width="60%">
      <el-form 
       :model="eddForm"
       label-width="100px" 
       :rules="addFormRules"
        ref="eddFormRef">
        <el-form-item label="分类名称:" prop="name">
          <el-input v-model="eddForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类排序:" prop="sort">
          <el-input v-model="eddForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="eddlogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="eddClss(eddForm.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // name: "Classify",
  data() {
    let checkInput = (rule,value,callback)=>{
    }
    let checkName = (rule, value, callback) => {
      const reg = /^[0-9]{1,2}$/;
      if (reg.test(value)) {
        return callback();
      }
      callback(new Error("请输入0~99之间的数字"));
    };
    return {
      tableData: [],
      dialogTableVisible: false,
      addForm: {
        name: "",
        sort: ""
      },
      addFormRules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "请输入长度在3~20个字符之间",
            trigger: "blur"
          }
        ],
        sort: [
          { required: true, message: "请输入分类排序", trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ]
      },
      eddlogTableVisible:false,
      eddForm:{},
      eddFormRules:{},
    };
  },
  created() {
    this.getinfo();
  },
  methods: {
    async getinfo() {
      const { data: res } = await this.axios.get("/admin/category");
      this.tableData = res.category;
    },

    // 新增
   async addClss() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const res = await this.axios.post("/admin/category", this.addForm);
        let category = res.data;
        if (res.status !== 200) {
          return this.$message.error("分类添加失败");
        }
        if (res.data.msg ==='此商品已经存在') {
          return this.$message.error("此商品已经存在");
        }
         this.dialogTableVisible = false;
         this.getinfo();
         this.$message.success("分类添加成功!");
      });
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    //修改
   async showeddDialog(id){
      console.log(id);
      this.eddlogTableVisible = true;
      const res = await this.axios.get('/admin/category/'+id);
       if (res.status !== 200) {
          return this.$message.error("查询分类失败");
        }
      this.eddForm = res.data.category;
    },
   async eddClss(id){
      this.$refs.eddFormRef.validate(async valid=>{
        if(!valid) return;
        const res = await this.axios.put('/admin/category/'+id,{
          name:this.eddForm.name,
          sort:this.eddForm.sort
        })
       if(res.status!==200){
         return this.$message.error('修改分类失败')
       }
        this.eddlogTableVisible = false;
        this.getinfo()
        this.$message.success('修改分类成功')
      })
    },
    eddDialogClosed(){
        this.$refs.eddFormRef.resetFields();
    },

    // 排序
   async sort(id,sort){
      console.log(id,sort);
      const res = await this.axios.put('/admin/category/'+id,{
        sort:sort
      })
      console.log(res);
      if(res.status!==200){
         return this.$message.error('修改排序失败')
       }
       this.$message.success("修改排序成功")
       this.getinfo()
    },

    //删除
   async removeUser(id){
     const eddDelete = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        console.log(eddDelete);// cancel  confirm
        if(eddDelete !== 'confirm'){
          return this.$message.info('已经取消删除')
        }
        const res = await this.axios.delete('/admin/category/'+id)
         if(res.status!==200){
         return this.$message.error('修改分类失败')
       }
       this.getinfo()
       this.$message.success('删除成功')
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  margin: 20px 30px;
}
</style>