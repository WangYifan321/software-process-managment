<template>
  <el-container>
    <el-header style="font-size: 12px">
      <el-link
        onclick="window.history.go(-1)"
        :underline="false"
        type="primary"
        icon="el-icon-arrow-left"
      >返回</el-link>
    </el-header>

    <el-main>
      <router-view></router-view>
      <div style="width:220px">
        <el-input placeholder="请输入新的密码" v-model="password" style="width:440px">
          <template slot="prepend">密码</template>
        </el-input>
      </div>
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入姓名" v-model="name" style="width:440px">
          <template slot="prepend">姓名</template>
        </el-input>
      </div>
      <div style="margin-top: 15px;">
        <el-select v-model="gender" slot="prepend" placeholder="性别" style="width:100px">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="0"></el-option>
        </el-select>
        <el-button
          @click.native="editting"
          type="primary"
          icon="el-icon-edit-outline"
          style="margin-left: 247px"
        >修改</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      name: "",
      gender: ""
    };
  },
  mounted() {
    this.name = String(this.$route.query.name1);
    this.gender = String(this.$route.query.gender1);
  },
  methods: {
    editting() {
      let id = String(this.$route.query.data);
      let _this = this;
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      let dic = {};
      if (this.password != "") {
        dic["password"] = this.password;
      }
      if (this.name != "") {
        dic["name"] = this.name;
      }
      if (this.gender != "") {
        dic["gender"] = this.gender;
      }
      this.$axios({
        method: "put",
        url: "api/v1/admin/users/" + id,
        data: dic,
        headers: headers
      })
        .then(res => {
          this.$message.success("修改成功");
          window.history.back(-1);
        })
        .catch(error => {
          this.$message.error("修改失败");
          console.log(error);
        });
    }
  }
};
</script>

<style>
.el-header {
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
}
</style>