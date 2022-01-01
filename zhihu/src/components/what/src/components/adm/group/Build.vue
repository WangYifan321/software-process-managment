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
        <el-input placeholder="请输入内容" v-model="academy" style="width:440px">
          <template slot="prepend">学院</template>
        </el-input>
      </div>
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容" v-model="grade" style="width:440px">
          <template slot="prepend">年级</template>
        </el-input>
      </div>
      <div style="margin-top: 15px;">
        <el-date-picker
          v-model="starttime"
          type="datetime"
          placeholder="学生选课开始时间"
          style="width:217px"
        ></el-date-picker>
        <el-date-picker
          v-model="endtime"
          type="datetime"
          placeholder="学生选课结束时间"
          style="width:217px"
        ></el-date-picker>
      </div>
      <div style="margin-top: 15px;">
        <el-date-picker
          v-model="teacherStarttime"
          type="datetime"
          placeholder="导师选择开始时间"
          style="width:217px"
        ></el-date-picker>
        <el-date-picker
          v-model="teacherEndtime"
          type="datetime"
          placeholder="导师选择结束时间"
          style="width:217px"
        ></el-date-picker>
      </div>
      <div style="margin-top: 15px;">
        <el-button
          @click.native="building"
          type="primary"
          icon="el-icon-edit-outline"
          style="margin-left: 350px"
        >创建</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      academy: "",
      grade: "",
      starttime: "",
      endtime: "",
      teacherStarttime: "",
      teacherEndtime: "",
      ground: "1"
    };
  },
  methods: {
    building() {
      let _this = this;
      let headers = {
        Authorization: localStorage.getItem("token")
        //"Content-Type": "application/json"
      };
      this.$axios({
        method: "post",
        url: "api/v1/admin/group",
        data: {
          academy: this.academy,
          grade: this.grade,
          ground: this.ground,
          starttime: this.starttime,
          endtime: this.endtime,
          teacherStarttime: this.teacherStarttime,
          teacherEndtime: this.teacherEndtime
        },
        headers: headers
      })
        .then(res => {
          this.$message.success("创建成功");
          _this.$router.push("../group/Group");
        })
        .catch(error => {
          this.$message.error("创建失败");
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