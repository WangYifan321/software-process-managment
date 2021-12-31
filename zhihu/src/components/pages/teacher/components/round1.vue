<template>
  <div class="student-list">
    <div class="student-list-title">
      <span class="student-list-title-icon"></span>
      <span class="student-list-title-text">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/courseheader' }">学院与年级</el-breadcrumb-item>
          <el-breadcrumb-item
            :to="{ name: 'finishcourse', params:{key:this.$route.params.groupid}}"
          >课程情况</el-breadcrumb-item>
          <el-breadcrumb-item>第一轮</el-breadcrumb-item>
          <el-breadcrumb-item v-if="priority===1?1:0">第一志愿</el-breadcrumb-item>
          <el-breadcrumb-item v-if="priority===2?1:0">第二志愿</el-breadcrumb-item>
          <el-breadcrumb-item v-if="priority===3?1:0">第三志愿</el-breadcrumb-item>
        </el-breadcrumb>
      </span>

      <ul class="nav">
        <li class="drop-down">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              志愿查看
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">第一志愿</el-dropdown-item>
              <el-dropdown-item command="b">第二志愿</el-dropdown-item>
              <el-dropdown-item command="c">第三志愿</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="nav-save">
          <el-button
            @click="speedupCheckbox"
            size="small"
            type="primary"
            :disabled="this.multipleSelection.length===0?true:false"
          >确认选择</el-button>
        </li>
        <li class="nav-choosen">
          <el-button @click="handleClick1" size="small" type="primary">查看已选择学生</el-button>
        </li>
      </ul>
    </div>
    <div class="reminder">
      <p class="present">当前轮次:{{this.round}}</p>
      <p class="number">已选人数:{{this.now1}}</p>
      <p class="most">剩余可选人数:{{this.limit-this.now}}</p>
    </div>
    <div class="student-list-table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        infinite-scroll-distance="0px"
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @selection-change="num"
      >
        <el-table-column type="selection" width="55" v-model="multipleSelection"></el-table-column>
        <el-table-column fixed label="序号" width="50" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="studentName" label="学生姓名"></el-table-column>
        <el-table-column prop="discipline" label="专业"></el-table-column>
        <el-table-column prop="gender" label="性别" :formatter="getgender"></el-table-column>
        <el-table-column prop="round" label="轮数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="searchdetails(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="student-details-form">
      <el-dialog title="学生详细信息" :visible.sync="dialogFormVisible">
        <el-form ref="form" label-width="80px" class="detailform">
          <el-row>
            <el-col :span="24">
              <el-form-item label="学生姓名:" placeholder="请输入内容">{{form.studentName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="专业:">{{form.discipline}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别:">{{form.gender==1 ? "男":form.gender==0?"女":"未知"}}</el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="学院:" placeholder="请输入内容">{{form.academy}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年级:" placeholder="请输入内容">{{form.grade}}</el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="自我介绍:">{{form.description}}</el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script >
export default {
  inject: ["reload"],
  name: "round1",

  data() {
    return {
      priority: 1,
      dialogFormVisible: false,
      limit: 0,
      most: 0,
      now: 0,
      now1: 0,
      round: 0,
      list: [],
      form: [],
      multipleSelection: [],
      page: 1,
      size: 0,
      loading: false,
      totalPages: "" //取后端返回内容的总页数
    };
  },
  created() {
    this.getmessage();
  },
  methods: {
    handleCommand(command) {
      if (command == "a") {
        this.getmessage();
      }
      if (command == "b") {
        this.getmessage2();
      }
      if (command == "c") {
        this.getmessage3();
      }
    },
    getdetails(courseid, studentid) {
      this.$axios({
        methods: "get",
        url: "api/v1/teacher/courses/" + courseid + "/students/" + studentid,
        params: {
          round: 1
        },

        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => {
          console.log(res.data);
          this.form = res.data;
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    },
    getgender(row, column) {
      return row.gender === 1 ? "男" : row.gender === 0 ? "女" : "未知";
    },
    handleClick(index, row) {
      this.id = row.id;
      const groupid = row.id;
      this.$router.push({ name: "finishcourse", params: { groupid } });
    },

    searchdetails(index, row) {
      this.dialogFormVisible = true;
      let courseid = this.$route.params.courseid;
      let studentid = row.studentId;
      this.getdetails(courseid, studentid);
      let round = row.round;
      let groupid = this.$route.params.groupid;
      /*this.$router.push({name: "studentdetails", params: {courseid,studentid,round,groupid}});*/
    },
    handleClick1() {
      let courseid = this.$route.params.courseid;
      let groupid = this.$route.params.groupid;
      this.$router.push({
        name: "choosenstudent",
        params: { courseid, groupid }
      });
    },
    num(val) {
      this.multipleSelection = val;
      this.now1 = this.multipleSelection.length;
      this.most = this.limit - this.now;
    },

    speedupData() {
      var arr = this.multipleSelection;
      let multis = [];
      for (var i = 0; i < arr.length; i++) {
        multis.push(arr[i].studentId);
        console.log(multis);
      }
      //以上为将数组中key值为id的数据遍历出来，然后，将所得到的数据传入mutis数组中，最后将multis数据提交至后端
      var url = "api/v1/teacher/course/student";
      let header = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$axios({
        method: "put",
        url: url,
        headers: header,
        data: {
          priority:this.priority,
          round: 1,
          course: this.$route.params.courseid,
          students: multis
        }
      })
        .then(res => {
          if (multis.length !== null) {
            this.reload();

          } else {
            this.$message({
              message: "选择失败",
              type: "warning"
            });
          }
          console.log(res);
          this.$refs.multipleTable.clearSelection(); //操作完成清除勾选框
        })
        .catch(error => {
          if (error.response.data.code == "E_NOT_TEACHER_CHOOSE_TIME") {
            this.$message({
              message: "教师选择还未开始",
              type: "warning"
            });
          } else if (error.response.data.code == "E_MUST_CHOOSE_ALL_STUDENT") {
            this.$message({
              message: "未满规定人数，请全选",
              type: "warning"
            });
          } else if (error.response.data.code == "E_MUST_CHOOSE_LEFT_QUOTA") {
            this.$message({
              message: "未满规定人数，请选满至规定人数",
              type: "warning"
            });
          } else if (error.response.data.code == "E_NOT_RIGHT_ROUND") {
            this.$message({
              message: "您选择的学生非当前轮次的学生",
              type: "warning"
            });
          } else if (error.response.data.code == "E_OVERFLOW_THE_LIMIT") {
            this.$message({
              message: "选择人数超出上限",
              type: "warning"
            });
          }
        });
    },
    //全速选择框
    speedupCheckbox() {
      this.speedupData();
    },

    load() {
      //滑到底部时进行加载
      this.loading = true;
      setTimeout(() => {
        this.page += 1; //页数+1
        this.getmessage(); //调用接口，此时页数+1，查询下一页数据
        console.log("hello");
      }, 2000);
    },
    getmessage() {
      this.courseid = this.$route.params.courseid;
      this.$axios({
        method: "get",
        url: "api/v1/teacher/courses/" + this.courseid + "/students",
        params: {
          page: this.page,
          size: 50,
          round: 1,
          type: 0,
          priority: 1
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => {
          console.log(res.data);
          this.round = res.data.ground;
          this.now = res.data.now;
          this.limit = res.data.limit;
          this.priority = 1;
          console.log(this.round);
          this.list = res.data.students;
          /*this.list=this.list.concat(res.data.students)
            this.totalPages = Math.ceil(res.data.count/20)
            this.loading = false;*/
        })
        .catch(error => {
          console.log(error);
          alert("暂无数据");
        });
    },
    getmessage2() {
      this.courseid = this.$route.params.courseid;
      this.$axios({
        method: "get",
        url: "api/v1/teacher/courses/" + this.courseid + "/students",
        params: {
          page: this.page,
          size: 50,
          round: 1,
          type: 0,
          priority: 2
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => {
          console.log(res.data);
          this.round = res.data.ground;
          this.now = res.data.now;
          this.limit = res.data.limit;
          this.priority = 2;
          console.log(this.round);
          this.list = res.data.students;
          /* this.list=this.list.concat(res.data.students)
            this.totalPages = Math.ceil(res.data.count/20)
            this.loading = false;*/
        })
        .catch(error => {
          console.log(error);
          alert("暂无数据");
        });
    },
    getmessage3() {
      this.courseid = this.$route.params.courseid;
      this.$axios({
        method: "get",
        url: "api/v1/teacher/courses/" + this.courseid + "/students",
        params: {
          page: this.page,
          size: 50,
          round: 1,
          type: 0,
          priority: 3
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => {
          console.log(res.data);
          this.round = res.data.ground;
          this.now = res.data.now;
          this.limit = res.data.limit;
          this.priority = 3;
          console.log(this.round);
          this.list = res.data.students;
          /* this.list=this.list.concat(res.data.students)
            this.totalPages = Math.ceil(res.data.count/20)
            this.loading = false;*/
        })
        .catch(error => {
          console.log(error);
          alert("暂无数据");
        });
    }
  },

  computed: {
    noMore() {
      //当起始页数大于总页数时停止加载

      return this.page >= this.totalPages;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  }
};
</script>
<style >
 .el-table thead {
  color: #222222;
}
.reminder {
  position: absolute;
  height: 20px;
  top: 50px;
  right: 70px;
}
p.present {
  position: relative;
  padding: 5px;
  height: 10px;
}
p.number {
  position: relative;
  height: 10px;
  padding: 5px;
}
.el-dialog {
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog__body {
  transform: translate3d(0, 0, 0);
  overflow: auto;
  height: 1000px;
  text-align: left;
}
.el-dialog__title {
  position: absolute;
  left: 350px;
}
.el-dialog__header {
  height: 50px;
  padding: 20px 20px 20px 20px !important;
  border-bottom: 1px solid #f4f4f4;
}
.detailform {
  float: left;
  width: 600px;
}
.student-list {
  width: 90%;
  margin: 0 auto;
  height: 100%;
  position: relative;
}
.student-list-title {
  height: 50px;
  padding-left: 30px;
  border-bottom: 1px solid #ddd;
}

.student-list-title-icon {
  float: left;
  width: 4px;
  height: 16px;
  margin-top: 18px;
  background-color: #00a1d6;
  border-radius: 4px;
}
.student-list-title-text {
  float: left;
  margin: 15px 0 0 5px;
  color: #00a1d6;
  font-size: 14px;
  cursor: default;
  line-height: 25px;
}
.student-list-table {
  width: 70%;
  height: 500px;
  padding: 20px;
  line-height: 10px;
  overflow-y: auto;
}
.nav {
  float: right;
  height: 100%;
  width: 50%;
  line-height: 80px;
  background: transparent;
  padding: 0;
  margin: 0;
  list-style: none;
}
.drop-down {
  margin: 0;
  width: 150px;
  float: right;
  list-style: none;
  position: relative;
  cursor: pointer;
  line-height: 50px;
}
.nav-choosen {
  margin: 0;
  width: 150px;
  float: right;
  list-style: none;
  position: relative;
  cursor: pointer;
  line-height: 50px;
}
.nav-save {
  margin: 0;
  width: 150px;
  float: right;
  list-style: none;
  position: relative;
  cursor: pointer;
  line-height: 50px;
}
</style>
