<template>
<div class="conten">
  <div class="container">
      <div class="container_item"><h2>注册</h2></div>
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginform" label-width="90px">
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
        <el-form-item prop="check_password" label="确认密码" >
          <el-input
            v-model="loginform.check_password"
            prefix-icon="iconfont icon-14"
            type="password"
          ></el-input>
        </el-form-item>
        
        <div>
            <el-button type="primary" class="btn" @click="login">注册</el-button>
            <el-button type="primary" class="btn" @click="handleReset">重置</el-button>
            <el-button type="primary" class="btn" @click="qudenglu">去登陆</el-button>
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
          {required:true,message:'请输入账号',trigger:'blur'},
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        check_password:[
          {required:true,message:'请确认密码',trigger:'blur'},
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      loginform:{}
    }
  },
  methods:{
    login(){      
      this.$refs.loginFormRef.validate( async valid=>{
        if(!valid)return
        const res = await this.axios.post('/admin/users/register',this.loginform)
        console.log(res);
        if(!res.data.success)return this.$message.error(res.data.message)
            this.$message.success(res.data.message)
        this.$router.push('/login')
      })
    },
    // 表单重置
    handleReset(){
      this.$refs.loginFormRef.resetFields()
    },
    qudenglu(){
        this.$router.push('/login')
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
  width: 500px;
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