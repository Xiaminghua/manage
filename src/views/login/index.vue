<template>
<body id="poster">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="ruleForm.checked">记住密码</el-checkbox>
    <br><br>
    <el-form-item style="width: 100%">
      <el-button
        type="primary"
        style="width: 100%;background: #505458;border: none"
        v-on:click="login"
      >登录</el-button>
    </el-form-item>
  </el-form>
</body>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在6到20之间", trigger: "blur" }
        ]
      },
      responseResult: [],
      systemUrl:''
    };
  },
  methods: {
    searchUrl(){
      this.$axios.get(`conf/getAppConfList`).then(successResponse => {
          let urlList = successResponse.data.appConfInfoList;
          for(var i = 0;i<urlList.length;i++){
            if(urlList[i].name == '系统管理'){
              this.systemUrl = 'http://' + urlList[i].ipAddr + ':' + urlList[i].port + '/';
              sessionStorage.setItem('systemUrl',this.systemUrl);
            }
          }
          // this.rolesList = successResponse.data.appConfInfoList;
      });
    },
    login() {
      let param = new URLSearchParams();
      param.append('loginName', this.ruleForm.username)
      param.append('password', this.ruleForm.password)
      this.$axios({
        method:"post",
        url:this.systemUrl + "login/login",
        data:param,
      }).then(res=>{
        if(res.data.ret == 'failed'){
          alert('登录失败')
        } else {
        if(this.ruleForm.checked == true){
          this.setCookie(this.ruleForm.username,this.ruleForm.password,7)
        } else{
          this.clearCoolie()
        }
          sessionStorage.setItem('userList',JSON.stringify(res.data.userInfo));
          this.$router.replace({ path: "/home" });
        }
        
      })
    },
    keyDown(e){
        //如果是回车则执行登录方法
      if(e.keyCode == 13){
        this.login();
      }
    },
    setCookie(name,pwd,day){
      var date = new Date();
      date.setTime(date.getTime()+24*60*60*1000*day);
      window.document.cookie = 'username' + '=' + name + ";path/;expires=" + date.toGMTString();
      window.document.cookie = 'password' + '=' + pwd + ";path/;expires=" + date.toGMTString();
    },
    getCookie(){
      if(document.cookie.length > 0){
        var arr = document.cookie.split(';');
        for(var i = 0;i<arr.length;i++){
          var arr2 = arr[i].split('=')
          if(arr2[0] == 'username'){
            // this.ruleForm.checked = true
            this.ruleForm.username = arr2[1];
          } else if(arr2[0] == ' password'){
            this.ruleForm.password = arr2[1];
          }
        }
      }
    },
    clearCoolie(){
      this.setCookie("","",-1)
    }
  },
  mounted(){
    this.searchUrl();
    window.addEventListener('keydown',this.keyDown);
    this.getCookie();
  },
  destroyed(){
    window.removeEventListener('keydown',this.keyDown,false);
  }
};
</script>
<style>
#poster {
    background:url("../../assets/bg.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: 0px;
    padding: 0;
  }
 
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
 
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>