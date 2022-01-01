<template>
  <div>
    <div class="outer_label">
      <img class="inner_label login_logo" src="../../assets/logo.png" />
    </div>
    <div class="login_form">
      <input type="text" class="qxs-ic_user qxs-icon" placeholder="用户名" v-model="userName" />
      <input type="password" class="qxs-ic_password qxs-icon" placeholder="密码" v-model="password" />
      <el-button
        class="login_btn"
        @click.native="login"
        type="primary"
        round
        :loading="isBtnLoading"
      >登录</el-button>
      <!-- <div style="margin-top: 10px">
        <span style="float: right;color: #A9A9AB">忘记密码？</span>
      </div>-->
    </div>
  </div>
</template>
 
 
 
<script>
import https from "../../https.js";

export default {
  data() {
    return {
      userName: "",
      password: "",
      isBtnLoading: false
    };
  },

  methods: {
    login() {
      let _this = this;
      let headers = { "Content-Type": "application/x-www-form-urlencoded" };
      if (!this.userName) {
        this.$message.error("请输入用户名");
        return;
      }
      if (!this.password) {
        this.$message.error("请输入密码");
        return;
      }
      console.log(this.userName);
      console.log(this.password);
      this.$axios({
        method: "post",
        url: "api/v1/auth/signin",
        data: {
          username: this.userName,
          password: this.password
        },
        headers
      })
        .then(res => {
          _this.userToken = "Bearer " + res.data.token;
          localStorage.setItem("token", _this.userToken);
          //_this.changeLogin({ Authorization: _this.userToken });
          if (res.data.role == 1) {
            _this.$router.push("../adm/Adm");
            this.$message.success("登陆成功");
          } else {
            this.$message.error("账号或密码错误");
          }
        })
        .catch(error => {
          this.$message.error("账号或密码错误");
          console.log(error);
        });
    }
  }
};
</script>
<style>
.login_form {
  padding-top: 10%;
  padding-left: 10%;
  padding-right: 10%;
}
.qxs-ic_user {
  background: url("../../assets/login/ic_user.png") no-repeat;
  background-size: 13px 15px;
  background-position: 3%;
}
.qxs-ic_password {
  background: url("../../assets/login/ic_password.png") no-repeat;
  background-size: 13px 15px;
  background-position: 3%;
  margin-bottom: 20px;
}
.login_logo {
  height: 100%;
}
.login_btn {
  width: 100%;
  font-size: 16px;
  background: -webkit-linear-gradient(
    left,
    #000099,
    #2154fa
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #000099,
    #2154fa
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #000099,
    #2154fa
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #000099, #2154fa); /* 标准的语法 */
  filter: brightness(1.4);
}
</style>
