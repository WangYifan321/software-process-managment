<template>
  <div class="container">
    <div class="container-title">
      <el-header style="text-align: right; font-size: 12px"></el-header>
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
        <el-table-column prop="grade" label="年级" width="100"></el-table-column>
        <el-table-column prop="ground" label="轮次" width="50"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="statusFormatter" width="100"></el-table-column>
        <el-table-column prop="starttime" label="学生选课开始时间" :formatter="stFormatter" width="180"></el-table-column>
        <el-table-column prop="endtime" label="学生选课结束时间" :formatter="etFormatter" width="180"></el-table-column>
        <el-table-column prop="done" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="jFirst(scope.row.id)">第一轮</el-button>
            <el-button size="mini" type="primary" plain @click="jSecond(scope.row.id)">第二轮</el-button>
            <el-button size="mini" type="primary" plain @click="jThird(scope.row.id)">第三轮</el-button>
            <el-button size="mini" type="primary" plain @click="jForth(scope.row.id)">第四轮</el-button>
            <el-button size="mini" type="success" plain @click="download(scope.row.id)">导出</el-button>
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
      data1: [],
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
    jFirst(id) {
      this.$router.push({
        path: "../adm/result/First",
        name: "First",
        query: { data: id }
      });
    },
    jSecond(id) {
      this.$router.push({
        path: "../adm/result/Second",
        name: "Second",
        query: { data: id }
      });
    },
    jThird(id) {
      this.$router.push({
        path: "../adm/result/Third",
        name: "Third",
        query: { data: id }
      });
    },
    jForth(id) {
      this.$router.push({
        path: "../adm/result/Forth",
        name: "Forth",
        query: { data: id }
      });
    },
    download(id) {
      const loading = this.$loading({
        lock: true,
        text: "操作中",
        //spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      let _this = this;
      let execlName = "result.xlsx";
      let url = "api/v1/admin/" + id + "/results/excels";
      this.$axios({
        method: "get",
        url: url,
        responseType: "blob",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          loading.close();
          const blob = new Blob([response.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          const aEle = document.createElement("a"); // 创建a标签
          const href = window.URL.createObjectURL(blob); // 创建下载的链接
          aEle.href = href;
          aEle.download = execlName; // 下载后文件名
          document.body.appendChild(aEle);
          aEle.click(); // 点击下载
          document.body.removeChild(aEle); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch(res => {
          _this.$message.error("导出失败");
        });
    }, //导出所有结果
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