<template>
<div class="conten">
  <div class="container">
      <div class="container_item"><h2>Login</h2></div>
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginform" label-width="80px">
          <el-form-item prop="username" label="账号" >
          <el-input
            v-model="loginform.username"
            prefix-icon="iconfont icon-denglu"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" >
          <el-input
            v-model="loginform.password"
            prefix-icon="iconfont icon-14"
            type="password"
          ></el-input>
        </el-form-item>
        <div>
            <el-button type="primary" class="btn" @click="login">登录</el-button>
            <el-button type="primary" class="btn" @click="handleReset">重置</el-button>
            <el-button type="primary" class="btn" @click="register" >去注册</el-button>
            </div>
      </el-form>
  </div>
  </div>

</template>

<script>
export default {
  data(){
    return{
      loginFormRules:{
        username:[
          {required:true,message:'账号不能为空',trigger:'blur'}
        ],
        password:[
          {required:true,message:'密码不能为空',trigger:'blur'}
        ]
      },
      loginform:{}
    }
  },
  methods:{
    login(){      
      this.$refs.loginFormRef.validate( async valid=>{
        // 表单预验证
        if(!valid)return
        const res = await this.axios.post('/admin/users/login',this.loginform)
        // 判断用户信息
        if(!res.data.success)return this.$message.error(res.data.message)
        this.$message.success(res.data.message)
        // 存储缓存
        localStorage.token_type = "Bearer"
        localStorage.access_token = res.data.token
        this.$router.push('/home')
      })
    },
    // 表单重置
    handleReset(){
      this.$refs.loginFormRef.resetFields()
    },
     register(){
        this.$router.push('/register')
      }
  },
}
</script>

<style lang="scss" scoped>
.conten{
  height: 100%;
  width: 100%;
   background: url('https://img.coolcr.cn/2020/06/02/6150fd7070e6f.png');
}
.container_item{
  text-align: center;
  color: #fff;   
    text-shadow:0 0 10px;   
    letter-spacing: 1px;   
    text-align: center;   
    
}
.container{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 500px;
  text-align: center;
}

</style>