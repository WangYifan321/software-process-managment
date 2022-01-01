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
        <el-input placeholder="请输入内容" v-model="count" style="width:440px">
          <template slot="prepend">开设课程数</template>
        </el-input>
      </div>
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容" v-model="limit" style="width:440px">
          <template slot="prepend">单节课上限</template>
        </el-input>
      </div>
      <div style="margin-top: 15px;">
        <el-button
          @click.native="editCourses()"
          type="primary"
          icon="el-icon-edit-outline"
          style="margin-left: 351px"
        >修改</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      count: "",
      limit: ""
    };
  },
  mounted() {
    this.count = String(this.$route.query.count1);
    this.limit = String(this.$route.query.limit1);
  },
  methods: {
    editCourses() {
      let id = String(this.$route.query.data);
      let _this = this;
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      let dic = {};
      if (this.count != "") {
        dic["count"] = this.count;
      }
      if (this.limit != "") {
        dic["limit"] = this.limit;
      }
      this.$axios({
        method: "put",
        url: "api/v1/admin/courses/" + id,
        data: dic,
        headers: headers
      })
        .then(res => {
          this.$message.success("修改成功");
          window.history.go(-1);
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