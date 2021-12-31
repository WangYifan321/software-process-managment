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
        <el-select
          @change="selectChanged"
          v-model="value"
          placeholder="状态选择"
          style="margin-right: 15px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入工号"
          v-model="searchinput"
          style="width: 250px; margin-right: 15px"
        >
          <el-button slot="append" icon="el-icon-search" @click="search(1)"></el-button>
        </el-input>
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
        border
        :data="data1"
        style="width: 100%"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="teacherNo" label="教师工号" sortable width="120"></el-table-column>
        <el-table-column prop="teacherName" label="教师姓名" width="120"></el-table-column>
        <el-table-column prop="academy" label="学院" sortable width="150"></el-table-column>
        <el-table-column prop="grade" label="年级" sortable width="80"></el-table-column>
        <el-table-column
          prop="isBanned"
          label="课程状态"
          sortable
          :formatter="isBannedFormatter"
          width="110"
        ></el-table-column>
        <el-table-column prop="ground" label="轮次" sortable width="80"></el-table-column>
        <el-table-column prop="status" label="轮次状态" :formatter="statusFormatter" width="80"></el-table-column>
        <el-table-column prop="limit" label="单节课上限" width="100"></el-table-column>
        <el-table-column prop="count" label="开设课程数" width="100"></el-table-column>
        <el-table-column prop="now" label="当前人数" width="100"></el-table-column>
        <el-table-column prop="done" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="jCoursesedit(scope.row.courseId,scope.row.count,scope.row.limit)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      data1: [],
      status: "",
      flag: 0,
      page: 1,
      size: 50,
      totalPages: "", //取后端返回内容的总页数
      loading: false,
      searchinput: "",
      options: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "0",
          label: "正常"
        },
        {
          value: "1",
          label: "已删除"
        },
        {
          value: "2",
          label: "未激活"
        }
      ],
      value: ""
    };
  },
  created() {
    this.getmessage();
  },
  methods: {
    jCoursesedit(id, count, limit) {
      this.$router.push({
        path: "../adm/course/Coursesedit",
        name: "Coursesedit",
        query: { data: id, count1: count, limit1: limit }
      });
    },
    load() {
      //滑到底部时进行加载
      this.loading = true;
      this.page += 1; //页数+1
      if (this.flag == 0) {
        this.getmessage();
      } else {
        this.getmessage2();
      }
    },
    getmessage() {
      let id = String(this.$route.query.data);
      this.$axios({
        methods: "get",
        url: "api/v1/admin/groups/" + id + "/courses",
        params: {
          status: this.status,
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
    getmessage1() {
      let id = String(this.$route.query.data);
      this.$axios({
        methods: "get",
        url: "api/v1/admin/groups/" + id + "/search",
        params: {
          keyword: this.searchinput,
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
    isBannedFormatter(row, isBanned) {
      let isBannedd;
      if (row.isBanned == 0) isBannedd = "正常";
      else if (row.isBanned == 1) isBannedd = "已删除";
      else isBannedd = "未激活";
      return isBannedd;
    },
    selectChanged(value) {
      this.status = value;
      this.page = 1;
      this.loading = false;
      this.totalPages = "";
      let id = String(this.$route.query.data);
      this.$axios({
        methods: "get",
        url: "api/v1/admin/groups/" + id + "/courses",
        params: {
          status: this.status,
          page: this.page,
          size: 50
        },
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          this.searchinput = "";
          this.data1 = res.data.data;
          this.totalPages = Math.ceil(res.data.count / 50);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    },
    search(num) {
      this.flag = num;
      this.page = 1;
      this.loading = false;
      this.totalPages = "";
      let id = String(this.$route.query.data);
      this.$axios({
        methods: "get",
        url: "api/v1/admin/groups/" + id + "/search",
        params: {
          keyword: this.searchinput,
          page: this.page,
          size: 50
        },
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          this.value = "";
          this.data1 = res.data.data;
          this.totalPages = Math.ceil(res.data.count / 50);
          this.loading = false;
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