<template>
  <div class="course">
    <div class="course-title">
      <span class="course-title-icon"></span>
      <span class="course-title-text">学院与年级</span>
    </div>
    <div class="course-table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        infinite-scroll-distance="0px"
        stripe
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column fixed label="序号" width="50" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="academy" label="学院" width="180"></el-table-column>
        <el-table-column prop="grade" label="年级" width="100"></el-table-column>
        <el-table-column prop="ground" label="轮数" width="100" :formatter="getround"></el-table-column>
        <el-table-column prop="teacherStarttime" label="开始时间" width="180" :formatter="stFormatter"></el-table-column>
        <el-table-column prop="teacherEndtime" label="截止时间" width="180" :formatter="etFormatter"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.$index,scope.row)" type="text" size="small">查看对应课程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script >
export default {
  name: "courseheader",
  data() {
    return {
      tableData: [],
      page: 1,
      size: 0,
      pagesize: 8,
      loading: false,
      totalPages: "" //取后端返回内容的总页数
    };
  },

  created() {
    this.getmessage();
  },
  methods: {
    getround(row, column) {
      return row.ground === 4 ? "额外轮" : row.ground;
    },
    stFormatter(row, teacherStarttime) {
      function formatFunc(str) {
        return str > 9 ? str : "0" + str;
      }
      var date = new Date(row.teacherStarttime);
      var year = date.getFullYear();
      var mon = formatFunc(date.getMonth() + 1);
      var day = formatFunc(date.getDate());
      var hour = formatFunc(date.getHours());
      var min = formatFunc(date.getMinutes());
      var dateStr = year + "-" + mon + "-" + day + "  " + hour + ":" + min;
      return dateStr;
    },
    etFormatter(row, teacherEndtime) {
      function formatFunc(str) {
        return str > 9 ? str : "0" + str;
      }
      var date = new Date(row.teacherEndtime);
      var year = date.getFullYear();
      var mon = formatFunc(date.getMonth() + 1);
      var day = formatFunc(date.getDate());
      var hour = formatFunc(date.getHours());
      var min = formatFunc(date.getMinutes());
      var dateStr = year + "-" + mon + "-" + day + "  " + hour + ":" + min;
      return dateStr;
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
      this.$axios({
        methods: "get",
        url: "api/v1/teacher/groups",
        params: {
          page: this.page,
          size: 20
        },

        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          console.log(res);
          this.tableData = this.tableData.concat(res.data.groups);
          this.totalPages = Math.ceil(res.data.count / 20);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    },
    /*handleSizeChange: function(size) {
                this.pagesize = size;
                /*console.log(this.pagesize)
            },
             handleCurrentChange: function(currentPage) {
                this.currentPage = currentPage;
                console.log(this.currentPage)
            },*/
    handleClick(index, row) {
      this.id = row.id;
      const groupid = row.id;
      this.$router.push({ name: "finishcourse", params: { groupid } });
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
<style scoped>
/deep/ .el-table thead {
  color: #222222;
}
.course {
  width: 100%;
  height: 100%;
  position: relative;
  margin: 0 auto;
}
.course-title {
  margin-left: 6%;
  height: 50px;
  padding-left: 30px;
  /*border-bottom: 1px solid #ddd;*/
}
.course-table {
  /*width: 70%;*/
  height: auto;
  padding: 20px;
  line-height: 10px;
  display: inline-block;
  /*overflow-y: auto;*/
}
.course-title-icon {
  float: left;
  width: 4px;
  height: 16px;
  margin-top: 18px;
  background-color: #00a1d6;
  border-radius: 4px;
}
.course-title-text {
  float: left;
  margin: 15px 0 0 5px;
  color: black;
  font-size: 14px;
  cursor: default;
  line-height: 25px;
}
/*.el-pagination{
        position: absolute;
        height:50px;
        bottom: 0px;
        left:400px;
        line-height:10px
      }
      .el-pager{
        height:50px;
        line-height:10px
      }*/
</style>
