<template>
  <div class="student-list">
    <div class="student-list-title">
      <span class="student-list-title-icon"></span>
      <span class="student-list-title-text">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/courseheader' }">学院与年级</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'finishcourse', params:{key:groupid}}">课程情况</el-breadcrumb-item>
          <el-breadcrumb-item
            :to="{ name: 'round4', params:{courseid:$route.params.courseid,
                        round:ground,
                        limit:limit,
                        groupid:$route.params.groupid
                       }}"
          >额外轮</el-breadcrumb-item>
          <el-breadcrumb-item>已选择学生</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
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
        :data="list"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
      >
        <el-table-column fixed label="序号" width="50" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="studentName" label="学生姓名"></el-table-column>
        <el-table-column prop="discipline" label="专业"></el-table-column>
        <el-table-column prop="gender" label="性别" :formatter="getgender"></el-table-column>
        <el-table-column prop="round" label="轮数" :formatter="getround"></el-table-column>
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
  name: "choosenstudent4",
  data() {
    return {
      dialogFormVisible: false,
      form: [],
      round: 0,
      ground: 0,
      limit: 0,
      list: [],
      multipleSelection: [],
      page: 1,
      size: 0,
      loading: false,
      totalPages: "" //取后端返回内容的总页数
    };
    courseid: this.$route.params.courseid;
  },
  created() {
    this.getmessage();
  },
  methods: {
    getround(row, column) {
      return row.round === 4 ? "额外轮" : row.round;
    },
    getdetails(courseid, studentid) {
      this.$axios({
        methods: "get",
        url: "api/v1/teacher/courses/" + courseid + "/students/" + studentid,
        params: {
          round: this.round
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
    load() {
      //滑到底部时进行加载
      this.loading = true;
      setTimeout(() => {
        this.page += 1; //页数+1
        this.getmessage(); //调用接口，此时页数+1，查询下一页数据
        console.log("hello");
      }, 2000);
    },
    getgender(row, column) {
      return row.gender === 1 ? "男" : row.gender === 0 ? "女" : "未知";
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
      this.id = this.$route.params.courseid;
      this.$axios({
        method: "get",
        url: "api/v1/teacher/courses/" + this.id + "/students",
        params: {
          page: this.page,
          size: 20,
          type: 1
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => {
          this.ground = res.data.ground;
          this.limit = res.data.limit;
          this.list = this.list.concat(res.data.students);
          this.totalPages = Math.ceil(res.data.count / 20);
          this.loading = false;
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    },
    handleSizeChange: function(size) {
      this.pagesize = size;
      /*console.log(this.pagesize) */
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      /*console.log(this.currentPage) */
    },
    searchdetails(index, row) {
      this.dialogFormVisible = true;
      let courseid = this.$route.params.courseid;
      let studentid = row.studentId;
      this.round = row.round;
      this.getdetails(courseid, studentid);
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
/deep/ .el-table thead {
  color: #222222;
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
  width: 100%;
  height: 100%;
  position: relative;
}
.student-list-title {
  height: 50px;
  padding-left: 30px;
  margin-left: 6%;
  /*border-bottom: 1px solid #ddd;*/
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
  height: auto;
  display: inline-block;
  padding: 20px;
  line-height: 10px;
  overflow-y: auto;
}
.nav {
  float: right;
  height: 100%;
  width: 70%;
  line-height: 80px;
  background: transparent;
  padding: 0;
  margin: 0;
  list-style: none;
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
.el-pagination {
  position: absolute;
  height: 50px;
  bottom: 0px;
  left: 400px;
  line-height: 10px;
}
.el-pager {
  height: 50px;
  line-height: 10px;
}
</style>
