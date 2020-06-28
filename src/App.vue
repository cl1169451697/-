<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
<style lang="scss" >
* {
  margin: 0;
  padding: 0;
}
body {
  margin: 0 !important;
}
html,
body,
#app,
.home,
.el-container,
.el-menu,
.tac {
  height: 100%;
}
::-webkit-scrollbar {
  display: none;
}
.el-main {
  padding: 0 !important;
}
.el-menu {
  border-right: none;
}
.container_home {
  height: 100%;
}
.el-header {
  display: flex;
  background-color: #373d41;
  justify-content: space-between; // 两边分散对齐
  align-items: center;
  padding-left: 0px;
  color: #fff;
  font: size 15px;
}
.el-header {
  padding: 0px !important;
}
.tables td,
.tables th {
  text-align: center !important;
}
.changeInput{
  width: 28%!important;
  input{

  text-align: center!important;
  }
}
.el-main{
  margin-left: 20px;
}
.el-pagination{
  text-align: center;
  margin-top: 30px;
}
// .el-form-item__content{
//   width: 50%;
// }
.login-item{
  a{
    color: #fff;
    text-decoration: none;
  }
  span{
    &:nth-child(1){
      margin-right: 60px;
    }
  }
}
.el-form-item__content .el-form-item__error{
  position: absolute;
  top: 95%;
}
.hello{
  height: 100%;
}
</style>
