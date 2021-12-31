<template>
  <div class="container">
    <div class="container-title">
      <el-header style="font-size: 12px">
        <el-link
          onclick="window.history.go(-1)"
          :underline="false"
          type="primary"
          icon="el-icon-arrow-left"
        >返回</el-link>
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
        <el-table-column prop="username" label="学号" sortable width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" width="150"></el-table-column>
        <el-table-column prop="gender" label="性别" sortable :formatter="genderFormatter" width="100"></el-table-column>
        <el-table-column prop="discipline" label="专业" sortable width="150"></el-table-column>
        <!-- <el-table-column prop="isBanned" label="状态" :formatter="isBannedFormatter" width="100"></el-table-column> -->
        <el-table-column prop="done" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              style="margin-right: 20px"
              @click="editTableData(scope.row.id,
                      scope.row.name,
                      scope.row.discipline,
                      scope.row.gender)"
            >编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      data1: [],
      page: 1,
      size: 50,
      totalPages: "", //取后端返回内容的总页数
      loading: false
    };
  },
  inject: ["reload"],
  created() {
    this.getmessage();
  },
  methods: {
    editTableData(id, name, discipline, gender) {
      this.$router.push({
        path: "../adm/view/Editstudent",
        name: "Editstudent",
        query: {
          data: id,
          name1: name,
          discipline1: discipline,
          gender1: gender
        }
      });
    },
    handleDelete(id) {
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("本操作将永久删除该学生, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "delete",
          url: "api/v1/admin/users/" + id,
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
    genderFormatter(row, gender) {
      let genderr;
      if (row.gender == 1) genderr = "男";
      else if (row.gender == 0) genderr = "女";
      else genderr = "未知";
      return genderr;
    },
    isBannedFormatter(row, isBanned) {
      let isBannedd;
      if (row.isBanned == 0) isBannedd = "正常";
      else isBannedd = "已删除";
      return isBannedd;
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
        url: "api/v1/admin/groups/" + id + "/students",
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