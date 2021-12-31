<template>
  <el-container>
    <el-header>
      <div class="title">欢迎使用创新实践师生互选系统</div>
      <div class="changepsd">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            用户
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="dialogFormVisible = true">修改密码</el-dropdown-item>
            <el-dropdown-item command="b" style="line-hight:">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="changepsd">
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="输入原密码" :label-width="formLabelWidth">
              <el-input v-model="form.oldPassword" autocomplete="off" type="password"></el-input>
            </el-form-item>
            <el-form-item label="输入新密码" :label-width="formLabelWidth">
              <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" :label-width="formLabelWidth">
              <el-input v-model="form.checkPassword" autocomplete="off" type="password"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="changepsd">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-header>
    <el-divider class="my-divider"></el-divider>
    <el-container>
      <el-aside width="280px">
        <div class="aside-inner">
          <div class="aside-inner-icon">
            <el-image src="./static/hangdian.jpg" class="aside-inner-icon-img"></el-image>
          </div>
          <div class="aside-inner-navmenu">
            <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
              <el-menu-item index="1">
                <i class="el-icon-location"></i>
                <span slot="title">个人信息</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">互选情况</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="main-inner">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Teacher",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        oldPassword: "",
        password: "",
        checkPassword: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    handleCommand(command) {
      if (command == "a") {
        this.changepsd();
      }
      if (command == "b") {
        this.out();
      }
    },
    changepsd() {
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
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "修改成功"
          });
        })
        .catch(error => {
          console.log(error.response.data.code);
          if (error.response.data.code == "E_PASSWORD_WRONG") {
            this.$message.error("原密码输入错误.");
          }
          if (error.response.data.code == "E_CHECKPASSWORD_WRONG") {
            this.$message.error("两次密码输入不一致,请重新输入!");
          }
        });
    },
    out() {
      this.$confirm("确定要退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          //确认退出，清除token
          localStorage.removeItem("token");
          //跳转登录页面(编程式导航)
          this.$router.push("/");
        })
        .catch(() => {});
    },
    handleSelect(key, keyPath) {
      switch (key) {
        case "1":
          this.$router.push("/person");
          break;
        case "2":
          this.$router.push("/courseheader");
          break;
      }
    }
  }
};
</script>

<style >
html,
body,
.el-container {
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
}
.my-divider {
  margin: 0px;
}
.el-header {
  background-color: #f6f6f6;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.title {
  position: absolute;
  width: 250px;
  height: 50px;
  line-height: 60px;
  left: 600px;
}
.changepsd {
  position: relative;
  float: right;
  width: 100px;
  line-height: 60px;
}
.el-dialog__body {
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  height: 1000px;
  width: 95%;
}
.el-dialog__footer {
  position: absolute;
  top: 300px;
  right: 270px;
  text-align: center !important;
  padding: 12px 20px 12px 20px !important;
  border-top: 1px solid #f4f4f4;
}
.logout {
  position: relative;
  float: right;
  width: 100px;
}
.el-aside {
  background-color: #f6f6f6;
  color: #333;
  text-align: center;
  line-height: 200px;
  padding: 20px;
}
.aside-inner {
  display: block;
  width: 200px;
  height: 100%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.aside-inner-icon {
  line-height: 80px;
  height: 150px;
}
.aside-inner-icon-img {
  position: relative;
  top: 40px;
  width: 50%;
}
.aside-inner-navmenu {
  height: 230px;
}
.el-menu-vertical-demo {
  text-align: left;
}

.el-main {
  background-color: #f6f6f6;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.main-inner {
  overflow: auto;
  height: 100%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>