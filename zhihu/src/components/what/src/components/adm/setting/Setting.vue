<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <el-button
        @click.native="logout"
        type="primary"
        icon="el-icon-s-home"
        style="margin-right: 15px"
      >登出</el-button>
    </el-header>

    <el-main>
      <div class="change_form">
        <input type="password" class="qxs-ic_confirm qxs-icon" placeholder="老密码" v-model="oldPassword" />
        <input type="password" class="qxs-ic_new qxs-icon" placeholder="新密码" v-model="password" />
        <input
          type="password"
          class="qxs-ic_confirm qxs-icon"
          placeholder="确认密码"
          v-model="checkPassword"
        />
        <el-button
          class="change_btn"
          @click.native="change"
          type="primary"
          round
          :loading="isBtnLoading"
        >修改密码</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<style>
.el-header {
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
}
.change_form {
  padding-top: 10%;
  padding-left: 10%;
  padding-right: 10%;
}
.qxs-ic_new {
  background: url("../../../assets/change/ic_new.png") no-repeat;
  background-size: 13px 15px;
  background-position: 3%;
}
.qxs-ic_confirm {
  background: url("../../../assets/change/ic_password.png") no-repeat;
  background-size: 13px 15px;
  background-position: 3%;
  margin-bottom: 20px;
}
.change_btn {
  width: 100%;
  font-size: 16px;
  background: linear-gradient(to right, #19191a, #4a4b4b); /* 标准的语法 */
  filter: brightness(1.4);
}
</style>

<script>
import https from "../../../https.js";

export default {
  data() {
    return {
      oldPassword: "",
      password: "",
      checkPassword: "",
      isBtnLoading: false
    };
  },

  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("../");
    },
    change() {
      let _this = this;
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      if (!this.oldPassword) {
        this.$message.error("请输入老的密码");
        return;
      }
      if (!this.password) {
        this.$message.error("请输入新的密码");
        return;
      }
      if (!this.checkPassword) {
        this.$message.error("请确认新密码");
        return;
      }
      if (this.confirm != this.newpassword) {
        this.$message.error("两次密码输入不同，请重新输入");
        return;
      }
      console.log(this.oldPassword);
      console.log(this.password);
      console.log(this.checkPassword);
      this.$axios({
        method: "put",
        url: "api/v1/auth/password",
        data: {
          oldPassword: this.oldPassword,
          password: this.password,
          checkPassword: this.checkPassword
        },
        headers: headers
      })
        .then(res => {
          this.$message.success("密码修改成功");
          this.$router.push("../");
        })
        .catch(error => {
          this.$message.error("修改失败");
          console.log(error);
        });
    }
  }
};
</script>