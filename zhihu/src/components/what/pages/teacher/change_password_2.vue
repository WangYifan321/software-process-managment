<template>

  <div id="login">
    <h1 id="title">修改密码</h1>
    <el-card shadow="never" id="card">
      <el-form  label-width="80px" :model="form" :label-position="labelPosition">
        <el-form-item label="旧密码">
          <el-input v-model="form.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="form.checkPassword" type="password"></el-input>
        </el-form-item>
        <el-button type="success" id="button" v-on:click="changepsd">更新密码</el-button>
      </el-form>


    </el-card>
  </div>
</template>

<script>

export default {
  name: "teacher_change_password",
  data() {
    return {
      labelPosition: 'top',
      form: {
        oldPassword: "",
        password: "",
        checkPassword: ""
      }

    };
  },
  methods:{
    changepsd() {
      if (localStorage.getItem("username") == this.form.password) {
        this.$message({
          type: "warning",
          message: "密码和账号不能相同，请重新修改"
        });
      } else {
        var url = "api/v1/auth/password";
        let header = {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        };
        this.$axios({
          method: "put",
          url: url,
          headers: header,
          data: {
            password: this.form.password,
            checkPassword: this.form.checkPassword,
            oldPassword: this.form.oldPassword
          }
        })
          .then(rs => {
            localStorage.setItem("flag", 0);
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.$router.push("/person")
          })
          .catch(error => {
            console.log(error.response.data.code);
            if (error.response.data.code == "E_PASSWORD_WRONG") {
              this.$message.error("原密码输入错误");
            }
            if (error.response.data.code == "E_CHECKPASSWORD_WRONG") {
              this.$message.error("两次密码输入不一致");
            }
          });
      }
    },
  },

  created() {

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
  margin-bottom: 50px;
}

#login{
  width: 350px;
  height: 500px;
  margin: 0 auto; /*水平居中*/
  transform: translateY(15%);

}
/*当屏幕宽度过小时*/
@media screen and (max-width:350px){
  #login{
    width: 95%;
    height: 500px;
    margin: 0 auto; /*水平居中*/
    transform: translateY(15%);
  }


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
</style>
