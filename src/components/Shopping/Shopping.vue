<template>
  <div>
    
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/shopping' }">商城中心</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/shopping/newshopping' }">商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 头部 -->
    <el-form class="form" :model="coustomer">
      <el-col :span="7">
        <el-row class="row row_button">
          <router-link :to="{name:'newshopping'}">
            <el-button type="success" icon="el-icon-edit">新增</el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" @click="batchRemove">删除</el-button>
          <el-button type="primary" icon="el-icon-edit">导出</el-button>
        </el-row>
      </el-col>
      <el-col :span="0.5" class="span1">所有分类</el-col>
      <el-col :span="4.5">
        <el-form-item >
          <el-select v-model="coustomer.categoryId" placeholder="请选择" @change="currentSel" >
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="0.5" class="span1">名称</el-col>
      <el-col :span="4">
          <el-form-item >
               <el-input v-model="coustomer.name" placeholder="商品名称"></el-input>
          </el-form-item>
      </el-col>
      <el-col :span="3">
           <el-button type="warning" icon="el-icon-search" class="btn" @click="submit">搜索</el-button>
      </el-col>
    </el-form>

    <!-- 表单 -->
    <el-table class="tables"
     :data="forProduct" 
      style="width: 100%" 
      border stripe
       @selection-change="handleSelectionChange">
         <el-table-column
      type="selection"
      width="55">
    </el-table-column>
      <el-table-column prop="id"  label="编号"  width="80"></el-table-column>
      <el-table-column prop="name" label="名称" width="140"></el-table-column>
      <el-table-column prop="image" label="缩略图" width="260">
          <template slot-scope="scope">
              <img :src="scope.row.image===null?'':scope.row.image" width="130px" alt="">
          </template>
      </el-table-column>
      <el-table-column  label="所属分类" width="140">
        <template slot-scope="scope">
        <el-tag type="danger">{{scope.row.Category.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="100"></el-table-column>
      <el-table-column prop="sale" label="已售" width="100"></el-table-column>
      <el-table-column prop="stock" label="库存" width="100"></el-table-column>
      <el-table-column label="创建时间">
          <template slot-scope="scope">
              <span>{{scope.row.createdAt | creaTime}}</span>
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" @click="handleEdd(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="romove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
  background
  layout="total, sizes, prev, pager, next, jumper"
  :total="page.total"
  :page-size="page.pageSize"
  :page-sizes="[3,5,8]"
  :current-page="page.currentPage"
  @size-change="handleSizeChange"
  @current-change = 'handleCurrentChange'>
</el-pagination>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      options: {},
      value:'',
      tableData:{},
      forProduct:[],
      category:[],// 搜索
      coustomer:{
          name:'',
          categoryId:''
      },
      page:{
          total:0,
          pageSize:0,
          currentPage:1
      },
       isIndeterminate: true,
       multipleSelection:[]//批量删除
    };
  },
  created() {
      this.getinfo()
      this.getClass()
  },
  filters:{
      creaTime(val){
      return moment(val).format('YYYY-MM-DD HH:mm');
      },
  },
  methods: {
     async getinfo(){
        const res = await this.axios.get(`/admin/product?currentPage=${this.page.currentPage}&categoryId=${this.coustomer.categoryId}`)
        let {Product}=res.data
        let {pagination:page}=res.data
        this.forProduct = Product
        this.page = {
            total:page.total,
            pageSize:page.pageSize,
            currentPage:page.currentPage
        }
      },
       async getClass(){
            const res = await this.axios.get('/admin/category')
            this.category = res.data.category
    },
     // 点击分页
      handleCurrentChange(val){
          this.page.currentPage = val
          this.getinfo()
      },
      handleSizeChange(val){
        this.page.pageSize = val;
        this.getinfo()
      },
      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val.map(item=>{
          return item.id
        });
        console.log(this.multipleSelection);

      },
      // 选项卡筛选
      currentSel(){
        this.getinfo()
      },
      // 模糊搜索
      submit(){
        if(this.coustomer.name=='')return this.$message.warning('请输入搜索内容')
        this.axios.get(`/admin/product?name=${this.coustomer.name}`).then((res)=>{
        this.forProduct = res.data.Product
        })
      },
      // 单条删除 
     async romove(id){
        const eddDelete = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(eddDelete !=='confirm'){
          return this.$message.info('已取消删除')
        }
        const res =await this.axios.delete('/admin/product/'+id)
         if(res.status!==200){
         return this.$message.error('删除失败')
       }
        this.getinfo()
       this.$message.success('删除成功')
      },
      // 多条删除
      batchRemove(){
        this.axios.post('/admin/product/delete_id',this.multipleSelection)
        // console.log(this.multipleSelection);
        this.getinfo()
      },
      // 编辑
      handleEdd(id){     
        this.$router.push({name:'compile',params:{id:id}})
      }
  }
};
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
.row_button{
  button{
    margin-right: 30px;
  }
}
</style>