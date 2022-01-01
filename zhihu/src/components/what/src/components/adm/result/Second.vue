<template>
  <div class="container">
    <div class="container-title">
      <el-header style="text-align: right; font-size: 12px">
        <el-link
          onclick="window.history.go(-1)"
          :underline="false"
          type="primary"
          icon="el-icon-arrow-left"
          style="float:left"
        >返回</el-link>
        <el-button
          @click.native="showStudent()"
          type="primary"
          icon="el-icon-notebook-2"
          style="margin-right: 15px"
        >查看未选择导师的学生</el-button>
        <el-button
          @click.native="showTeacher()"
          type="primary"
          icon="el-icon-notebook-2"
          style="margin-right: 15px"
        >查看未被选择的导师</el-button>
      </el-header>
    </div>

    <div class="container-table">
      <el-table
        v-loading="loading"
        ref="Table"
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
        <el-table-column prop="teacherNo" label="教师工号" sortable width="150"></el-table-column>
        <el-table-column prop="teacherName" label="教师姓名" width="150"></el-table-column>
        <el-table-column prop="isBanned" label="状态" :formatter="isBannedFormatter" width="100"></el-table-column>
        <el-table-column prop="limit" label="最高人数" width="100"></el-table-column>
        <el-table-column prop="now" label="当前总人数" width="100"></el-table-column>
        <el-table-column label="本轮已选人数" width="120">
          <template slot-scope="props">
            <span>{{props.row.student.length}}</span>
          </template>
        </el-table-column>
        <el-table-column label="本轮匹配人数" :formatter="beixuanFormatter" width="120"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.isBanned ==0?false:true"
              @click="handleDelete(scope.row.teacherId)"
            >删除</el-button>
            <el-button
              size="mini"
              type="success"
              :disabled="scope.row.isBanned ==1?false:true"
              @click="revokeDelete(scope.row.teacherId)"
            >恢复</el-button>
            <el-button size="mini" type="primary" plain @click="toogleExpand(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="1">
          <template slot-scope="props">
            <el-table
              :data="props.row.student"
              :default-sort="{prop: 'rstatus', order: 'descending'}"
              height="100%"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="username" label="学生学号" sortable width="150">
                <template slot-scope="props">
                  <span>{{props.row.username}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="学生姓名" width="150">
                <template slot-scope="props">
                  <span>{{props.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="discipline" label="学生专业" sortable width="200">
                <template slot-scope="props">
                  <span>{{props.row.discipline}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="priority" label="志愿" sortable width="80">
                <template slot-scope="props">
                  <span>{{props.row.priority}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="rstatus" label="结果" sortable width="80">
                <template slot-scope="props">
                  <span>{{props.row.rstatus==0?"未选":"已选"}}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="本轮未选择老师的学生" :visible.sync="dialogTableVisible" width="500px">
        <el-table :data="errStudent" :default-sort="{prop: 'username', order: 'ascending'}">
          <el-table-column type="index" width="90"></el-table-column>
          <el-table-column property="username" label="学号" sortable width="180"></el-table-column>
          <el-table-column property="name" label="姓名" width="180"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogTableVisible = false">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="本轮未被选择的导师" :visible.sync="dialogTableVisible1" width="600px">
        <el-table :data="errTeacher" :default-sort="{prop: 'username', order: 'ascending'}">
          <el-table-column type="index" width="90"></el-table-column>
          <el-table-column property="username" label="工号" sortable width="130"></el-table-column>
          <el-table-column property="name" label="姓名" width="130"></el-table-column>
          <el-table-column property="now" label="人数" width="100"></el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogTableVisible1 = false">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      data1: [],
      errStudent: [],
      errTeacher: [],
      dialogTableVisible: false,
      dialogTableVisible1: false,
      page: 1,
      size: 50,
      loading: false,
      totalPages: "" //取后端返回内容的总页数
    };
  },
  inject: ["reload"],
  created() {
    this.getmessage();
  },
  methods: {
    toogleExpand(row) {
      let $table = this.$refs.Table;
      this.data1.map(item => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    },
    load() {
      //滑到底部时进行加载
      this.loading = true;
      this.page += 1; //页数+1
      this.getmessage(); //调用接口，此时页数+1，查询下一页数据
    },
    getmessage() {
      let id = String(this.$route.query.data);
      this.$axios({
        methods: "get",
        url: "api/v1/admin/" + id + "/results",
        params: {
          round: 2,
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
    },
    isBannedFormatter(row, isBanned) {
      let isBannedd;
      if (row.isBanned == 0) isBannedd = "正常";
      else if (row.isBanned == 1) isBannedd = "已删除";
      else isBannedd = "未激活";
      return isBannedd;
    },
    beixuanFormatter(row, student) {
      var num = 0;
      for (var j = 0, len = row.student.length; j < len; j++) {
        if (row.student[j].rstatus == 1) num++;
      }
      return num;
    },
    showStudent() {
      let id = String(this.$route.query.data);
      this.$axios({
        methods: "get",
        url: "api/v1/admin/" + id + "/violation/students/?round=2",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          this.errStudent = res.data;
          this.dialogTableVisible = true;
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    },
    showTeacher() {
      let id = String(this.$route.query.data);
      this.$axios({
        methods: "get",
        url: "api/v1/admin/" + id + "/roundempty/teachers/?round=2",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          this.errTeacher = res.data;
          this.dialogTableVisible1 = true;
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    },
    handleDelete(id) {
      let groupid = String(this.$route.query.data);
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("本操作将删除该教师的课程, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "delete",
          url: "api/v1/admin/teachers/" + id + "/groups/" + groupid,
          headers: headers
        })
          .then(res => {
            this.$message.success("删除成功");
            this.reload();
          })
          .catch(error => {
            this.$message.error("删除失败");
            console.log(error);
          });
      });
    },
    revokeDelete(id) {
      let groupid = String(this.$route.query.data);
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("本操作将恢复该教师的课程, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "put",
          url: "api/v1/admin/teachers/" + id + "/groups/" + groupid,
          headers: headers
        })
          .then(res => {
            this.$message.success("恢复成功");
            this.reload();
          })
          .catch(error => {
            this.$message.error("恢复失败");
            console.log(error);
          });
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