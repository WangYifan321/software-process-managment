<template>
  <div class="container">
    <div class="container-title">
      <el-header style="text-align: right; font-size: 12px">
        <el-button
          @click.native="build()"
          type="primary"
          icon="el-icon-circle-plus"
          style="margin-right: 15px"
        >创建</el-button>
      </el-header>
    </div>

    <div class="container-table">
      <el-table
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(f, f, f, f)"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        infinite-scroll-distance="500"
        :data="data1"
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="academy" label="学院" width="150"></el-table-column>
        <el-table-column prop="grade" label="年级" width="80"></el-table-column>
        <el-table-column prop="ground" label="轮次" width="50"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="statusFormatter" width="100"></el-table-column>
        <el-table-column prop="starttime" label="学生选课开始时间" :formatter="stFormatter" width="200"></el-table-column>
        <el-table-column prop="endtime" label="学生选课结束时间" :formatter="etFormatter" width="200"></el-table-column>
        <el-table-column prop="done" label="操作" width="290">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              style="margin-top: 15px;"
              @click="edit(scope.row.id,
                      scope.row.academy,
                      scope.row.grade,
                      scope.row.starttime,
                      scope.row.endtime,
                      scope.row.teacherStarttime,
                      scope.row.teacherEndtime,
                      scope.row.ground,
                      scope.row.template)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="success"
              plain
              :disabled="scope.row.status ==0?false:true"
              style="margin-top: 15px;"
              @click="studentstart(scope.row.id)"
            >学生开始</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              :disabled="scope.row.status ==1?false:true"
              style="margin-top: 15px;"
              @click="studentend(scope.row.id)"
            >学生结束</el-button>
            <el-button
              size="mini"
              type="success"
              plain
              :disabled="(scope.row.status ==0?true:false)||(scope.row.status ==1?true:false)||(scope.row.status ==5?true:false)||scope.row.status ==6?true:false"
              style="margin-top: 15px;"
              @click="teachernext(scope.row.id,  scope.row.status)"
            >教师下轮</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              :disabled="scope.row.status ==5?false:true"
              style="margin-top: 15px;"
              @click="teacherend(scope.row.id)"
            >教师结束</el-button>
            <el-button
              size="mini"
              type="success"
              plain
              :disabled="(scope.row.status !=6?true:false)||(scope.row.ground==4?true:false)"
              style="margin-top: 15px;"
              @click="next(scope.row.id,scope.row.ground)"
            >下一轮</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="upload" label="上传">
          <template slot-scope="scope">
            <el-upload
              :action="getstudenturl(scope.row.id)"
              :headers="myheaders"
              ref="newupload"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-progress="openFullScreen"
            >
              <el-button size="mini" type="primary" plain style="margin-top: 15px">导入学生</el-button>
            </el-upload>
            <el-upload
              :action="getteacherurl(scope.row.id)"
              :headers="myheaders"
              ref="newupload"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-progress="openFullScreen"
            >
              <el-button size="mini" type="primary" plain style="margin-top: 15px">导入教师</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="本轮未选择学生的老师" :visible.sync="dialogTableVisible" width="500px">
        <el-table :data="errMessage" :default-sort="{prop: 'teacherNo', order: 'ascending'}">
          <el-table-column type="index" width="90"></el-table-column>
          <el-table-column property="teacherNo" label="工号" sortable width="180"></el-table-column>
          <el-table-column property="teacherName" label="教师姓名" width="180"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogTableVisible = false">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
var loading;
export default {
  inject: ["reload"],
  data() {
    return {
      data1: [],
      errMessage: [],
      dialogTableVisible: false,
      page: 1,
      size: 50,
      totalPages: "", //取后端返回内容的总页数
      loading: false,
      myheaders: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getmessage();
  },
  methods: {
    build() {
      this.$router.push("../group/Build");
    }, //创建
    edit(
      id,
      academy,
      grade,
      starttime,
      endtime,
      teacherStarttime,
      teacherEndtime,
      ground,
      template
    ) {
      this.$router.push({
        path: "../group/Edit",
        name: "Edit",
        query: {
          data: id,
          academy1: academy,
          grade1: grade,
          starttime1: starttime,
          endtime1: endtime,
          teacherStarttime1: teacherStarttime,
          teacherEndtime1: teacherEndtime,
          ground1: ground,
          template1: template
        }
      });
    },
    studentstart(id) {
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("将开放学生选择导师, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "put",
          url: "api/v1/admin/groups/" + id,
          data: {
            status: "1"
          },
          headers: headers
        })
          .then(res => {
            this.$message.success("学生开始选课");
            this.reload();
          })
          .catch(error => {
            this.$message.error("操作失败");
            console.log(error);
          });
      });
    },
    studentend(id) {
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("将结束本轮学生选择导师, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "put",
          url: "api/v1/admin/groups/" + id,
          data: {
            status: "2"
          },
          headers: headers
        })
          .then(res => {
            this.$message.success("学生结束选课");
            this.reload();
          })
          .catch(error => {
            this.$message.error("操作失败");
            console.log(error);
          });
      });
    },
    teachernext(id, status1) {
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("将开放导师选择学生下一志愿, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "put",
          url: "api/v1/admin/groups/" + id,
          data: {
            status: status1 + 1
          },
          headers: headers
        })
          .then(res => {
            if (res.data) {
              this.errMessage = res.data.errMessage;
              this.dialogTableVisible = true;
            } else {
              this.$message.success("导师开始选择学生下一志愿");
              this.reload();
            }
          })
          .catch(error => {
            this.$message.error("操作失败");
            console.log(error);
          });
      });
    },
    teacherend(id) {
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("将结束本轮导师选择学生, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "put",
          url: "api/v1/admin/groups/" + id,
          data: {
            status: "6"
          },
          headers: headers
        })
          .then(res => {
            if (res.data) {
              this.errMessage = res.data.errMessage;
              this.dialogTableVisible = true;
            } else {
              this.$message.success("导师结束选择学生");
              this.reload();
            }
          })
          .catch(error => {
            this.$message.error("操作失败");
            console.log(error);
          });
      });
    },
    next(id, ground) {
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("将进入下一轮选择, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "put",
          url: "api/v1/admin/groups/" + id,
          data: {
            ground: ground + 1,
            status: 0
          },
          headers: headers
        })
          .then(res => {
            this.$message.success("进入下一轮");
            this.reload();
          })
          .catch(error => {
            this.$message.error("操作失败");
            console.log(error);
          });
      });
    },
    getstudenturl(id) {
      let studenturl =
        "http://127.0.0.1:1337/api/v1/admin/" + id + "/students";
      return studenturl;
    },
    getteacherurl(id) {
      let studenturl =
        "http://127.0.0.1:1337/api/v1/admin/" + id + "/teachers";
      return studenturl;
    },
    uploadSuccess(res) {
      loading.close();
      this.$message({
        message:
          "操作成功，创建新账户" +
          res.createdCount +
          "人，更新信息" +
          res.updateInfo.updatedCount +
          "人，错误或重复上传" +
          res.errInfo.errCount +
          "人",
        type: "warning"
      });
    },
    stFormatter(row, starttime) {
      function formatFunc(str) {
        return str > 9 ? str : "0" + str;
      }
      var date = new Date(row.starttime);
      var year = date.getFullYear();
      var mon = formatFunc(date.getMonth() + 1);
      var day = formatFunc(date.getDate());
      var hour = formatFunc(date.getHours());
      var min = formatFunc(date.getMinutes());
      var sec = formatFunc(date.getSeconds());
      var dateStr =
        year + "-" + mon + "-" + day + "  " + hour + ":" + min + ":" + sec;
      return dateStr;
    },
    etFormatter(row, endtime) {
      function formatFunc(str) {
        return str > 9 ? str : "0" + str;
      }
      var date = new Date(row.endtime);
      var year = date.getFullYear();
      var mon = formatFunc(date.getMonth() + 1);
      var day = formatFunc(date.getDate());
      var hour = formatFunc(date.getHours());
      var min = formatFunc(date.getMinutes());
      var sec = formatFunc(date.getSeconds());
      var dateStr =
        year + "-" + mon + "-" + day + "  " + hour + ":" + min + ":" + sec;
      return dateStr;
    },
    statusFormatter(row, status) {
      let st;
      if (row.status == 0) st = "就绪";
      else if (row.status == 1) st = "学生选择中";
      else if (row.status == 2) st = "学生结束";
      else if (row.status == 3) st = "教师一";
      else if (row.status == 4) st = "教师二";
      else if (row.status == 5) st = "教师三";
      else st = "教师结束";
      return st;
    },
    openFullScreen() {
      loading = this.$loading({
        lock: true,
        text: "操作中",
        //spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
    },
    load() {
      //滑到底部时进行加载
      this.loading = true;
      this.page += 1; //页数+1
      this.getmessage(); //调用接口，此时页数+1，查询下一页数据
    },
    getmessage() {
      this.$axios({
        methods: "get",
        url: "api/v1/admin/groups",
        params: {
          page: this.page,
          size: 50
        },
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          this.data1 = this.data1.concat(res.data.data);
          this.loading = false;
          this.totalPages = Math.ceil(res.data.count / 50);
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    }
  },
  computed: {
    noMore() {
      return this.page >= this.totalPages;
    },
    disabled() {
      return this.loading || this.noMore;
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
.container-table {
  width: 95%;
  height: 600px;
  padding: 20px;
  line-height: 10px;
  overflow-y: auto;
  display: inline-block;
}
.container {
  width: 100%;
  height: 100%;
  position: relative;
}
.container-title {
  height: 50px;
  border-bottom: 1px solid #ddd;
  font-size: 12px;
}
</style>
