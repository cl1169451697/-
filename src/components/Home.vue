<template>
  <div class="hello">
   <!-- <router-view></router-view> -->
   <el-container class="container_home">
      <!-- 头部 -->
      <el-header>
        <span>扫码购</span>
        <div class="login-item">
          <router-link to="/"><span>登录</span></router-link>
        <a href=""><span @click="resetLoginForm">退出</span></a>
        </div>
      </el-header>
      <!-- 中间 -->
      <el-container>
        <!-- 中间左侧 -->
        <el-aside width="200px">
          <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
            <el-menu-item index="/classify">商品分类</el-menu-item>
            <el-menu-item index="/shopping">商品信息</el-menu-item>
            <el-menu-item index="1-3">选项1</el-menu-item>
            <el-menu-item index="1-4">选项1</el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 中间右侧 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  // name: 'HelloWorld',
  data () {
    return {
    
    }
  },
  methods:{
    resetLoginForm(){
        localStorage.removeItem('token_type')
        localStorage.removeItem('access_token')
        this.$message.success('退出成功')
        this.$router.push('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
