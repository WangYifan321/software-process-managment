<template>
  <div id="login">
    <h2 id="title">HDU创新实践导师双选</h2>
  <el-card shadow="never" id="card">
  <el-form  label-width="80px" :model="loginForm" :label-position="labelPosition" :rules="loginRules" ref="loginForm">
    <el-form-item label="用户名">
      <el-input v-model="loginForm.userName"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="loginForm.passWord" type="password"></el-input>
    </el-form-item>
    <el-button type="success" id="button" v-on:click="checkin" @keyup.enter="enterSearch">登录</el-button>
  </el-form>


    </el-card>
  </div>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "login_2",
  data() {
    return {
      labelPosition: 'top',
      loginForm: {
        userName: "",
        passWord: ""
      },
      loginRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods:{
    ...mapMutations(['changeLogin']),
    checkin(){
      let _this=this;
      let headers={'Content-Type':'application/json'}
      if (this.loginForm.userName=== '' || this.loginForm.passWord === '') {
        this.$message({
          message: '账号或密码不能为空',
          type: 'warning'
        });
      }
      else{
        this.$axios({
          method:'post',
          url:'api/v1/auth/signin',
          data:{
            'username':this.loginForm.userName,
            'password':this.loginForm.passWord

          },headers})
          .then((res)=>{
            console.log(res.data);
            _this.userToken = 'Bearer ' + res.data.token;
            _this.role=res.data.role
            _this.username =this.loginForm.userName;
            console.log(_this.username)
            let flag=res.data.flag
            localStorage.setItem('token',_this.userToken);
            localStorage.setItem('username',_this.username);
            localStorage.setItem('flag',flag);
            localStorage.setItem('name',res.data.name);
            //_this.changeLogin({ Authorization: _this.userToken });
            if(_this.role===2)//用户角色是老师
            {
              _this.$router.push({name:'person', params: {flag}})
            }

            if(_this.role===3)//用户角色是学生
            {

              _this.$router.push({name:'studentpersonal', params: {flag}})
            }
            console.log(	_this.userToken);
            console.log(	_this.role);

          })
          .catch((error) => {
            this.$message({
              message: '账号或密码错误',
              type: 'warning'
            });
            console.log(error);
          });

      }
    },
    enterSearch(){
      document.onkeydown = e =>{
        //13表示回车键，baseURI是当前页面的地址，为了更严谨，也可以加别的，可以打印e看一下
        if (e.keyCode === 13) {
          //回车后执行搜索方法
          this.checkin()
        }
      }
    }
  },

  created() {
    this.enterSearch()
  }
}
</script>

<style scoped>
html,body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

  body {

  }

  #title{
    margin-top: -30px;
    margin-bottom: 50px;
  }

  #login{
    width: 350px;
    height: 500px;
    margin: 0 auto; /*水平居中*/
    transform: translateY(30%);

  }

  #card{
    background-color: #f6f8fa;
    border-radius: 6px;
  }

  /deep/ .el-form-item__label{
    float: left;
    height: 35px;
  }

  /deep/ .el-input__inner{
    height: 35px;
  }

  /deep/ .el-form-item{
    margin-top: -17px;
  }
  #button{
    width: 100%;
    background-color: #2da44e;
    color: white;
    border: 1px solid;
    border-radius: 6px;
  }

/*当屏幕宽度过小时*/
@media screen and (max-width:350px){
  #login{
    width: 95%;
    height: 500px;
    margin: 0 auto; /*水平居中*/
    transform: translateY(30%);
  }


}

</style>
