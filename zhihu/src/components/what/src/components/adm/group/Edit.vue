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
      <div>
        <el-input placeholder="请输入学院名称" v-model="academy" style="width:327px">
          <template slot="prepend">学院</template>
        </el-input>
        <el-input placeholder="请输入年级" v-model="grade" style="width:327px">
          <template slot="prepend">年级</template>
        </el-input>
      </div>
      <div style="margin-top: 15px;">
        <el-date-picker v-model="starttime" type="datetime" placeholder="开始时间" style="width:327px"></el-date-picker>
        <el-date-picker v-model="endtime" type="datetime" placeholder="结束时间" style="width:327px"></el-date-picker>
      </div>
      <div style="margin-top: 15px;">
        <el-date-picker
          v-model="teacherStarttime"
          type="datetime"
          placeholder="导师选择开始时间"
          style="width:327px"
        ></el-date-picker>
        <el-date-picker
          v-model="teacherEndtime"
          type="datetime"
          placeholder="导师选择结束时间"
          style="width:327px"
        ></el-date-picker>
      </div>
      <div style="margin-top: 15px;">
        <el-select v-model="ground" slot="prepend" placeholder="轮次" style="width:150px">
          <el-option label="第一轮" value="1"></el-option>
          <el-option label="第二轮" value="2"></el-option>
          <el-option label="第三轮" value="3"></el-option>
          <el-option label="第四轮" value="4"></el-option>
        </el-select>
        <div style="margin-top: 1px; font-size: 10px; margin-left: 5px">*手动切换轮次</div>
      </div>
      <div style="margin-top: 15px;">
        <quill-editor ref="myTextEditor" v-model="template" style="width:660px"></quill-editor>
      </div>
      <div style="margin-top: 15px;">
        <el-button
          @click.native="editting"
          type="primary"
          icon="el-icon-edit-outline"
          style="margin-left: 570px"
        >修改</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  data() {
    return {
      academy: "",
      grade: "",
      starttime: "",
      endtime: "",
      teacherStarttime: "",
      teacherEndtime: "",
      ground: "",
      template: "",
      editorOption: {
        placeholder: "输入模板内容"
      }
    };
  },
  components: {
    quillEditor
  },
  mounted() {
    this.academy = String(this.$route.query.academy1);
    this.grade = String(this.$route.query.grade1);
    this.starttime = String(this.$route.query.starttime1);
    this.ground = String(this.$route.query.ground1);
    this.endtime = String(this.$route.query.endtime1);
    this.teacherStarttime = String(this.$route.query.teacherStarttime1);
    this.teacherEndtime = String(this.$route.query.teacherEndtime1);
    this.template = String(this.$route.query.template1);
  },
  methods: {
    editting() {
      let id = String(this.$route.query.data);
      let dic = {};
      if (this.academy != "") {
        dic.academy = this.academy;
      }
      if (this.grade != "") {
        dic.grade = this.grade;
      }
      if (this.starttime != "") {
        dic.starttime = this.starttime;
      }
      if (this.endtime != "") {
        dic.endtime = this.endtime;
      }
      if (this.teacherStarttime != "") {
        dic.teacherStarttime = this.teacherStarttime;
      }
      if (this.teacherEndtime != "") {
        dic.teacherEndtime = this.teacherEndtime;
      }
      if (this.ground != "") {
        dic.ground = this.ground;
      }
      if (this.template != "") {
        dic.template = this.template;
      }
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$axios({
        method: "put",
        url: "api/v1/admin/groups/" + id,
        data: dic,
        headers: headers
      })
        .then(res => {
          this.$message.success("修改成功");
          this.$router.push("../group/Group");
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