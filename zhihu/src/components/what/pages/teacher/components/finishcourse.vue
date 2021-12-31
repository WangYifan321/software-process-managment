<template>
  <div class="fncourse">
    <div class="fncourse-title">
      <span class="fncourse-title-icon"></span>
      <span class="fncourse-title-text">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/courseheader' }">学院与年级</el-breadcrumb-item>
          <el-breadcrumb-item>课程情况</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>
    <div class="fncourse-table">
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column fixed label="序号" width="50" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="academy" label="学院" width="180"></el-table-column>
        <el-table-column prop="grade" label="年级" width="180"></el-table-column>
        <el-table-column prop="ground" label="轮数" :formatter="getround"></el-table-column>
        <el-table-column prop="count" label="开设课程数"></el-table-column>
        <el-table-column prop="limit" label="限制人数"></el-table-column>
        <el-table-column prop="now" label="现在选择人数"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <!--<el-button @click="handleClick1(scope.$index,scope.row)" type="text" size="small">查看学生</el-button>-->
            <el-dropdown size="small" split-button trigger="click">
              查看对应轮次
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="gotoround1(scope.$index,scope.row)"
                  v-if="list[0].ground>=1?1:0"
                >第一轮</el-dropdown-item>
                <el-dropdown-item
                  @click.native="gotoround2(scope.$index,scope.row)"
                  v-if="list[0].ground>=2?1:0"
                >第二轮</el-dropdown-item>
                <el-dropdown-item
                  @click.native="gotoround3(scope.$index,scope.row)"
                  v-if="list[0].ground>=3?1:0"
                >第三轮</el-dropdown-item>
                <el-dropdown-item
                  @click.native="gotoround4(scope.$index,scope.row)"
                  v-if="list[0].ground==4?1:0"
                >额外轮</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script >
export default {
  name: "finishcourse",
  data() {
    return {
      list: [],
      disabled: 0,
      groupid: ""
    };
  },
  methods: {
    /* handleClick1(index,row){
                      const courseid = row.id;
                      const round = row.ground
                      const limit = row.limit
                      this.$router.push({name: "studentlist", params: {courseid,round,limit}});

          }*/
    getround(row, column) {
      return row.ground === 4 ? "额外轮" : row.ground;
    },
    handleSizeChange: function(size) {
      this.pagesize = size;
      /*console.log(this.pagesize) */
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      /*console.log(this.currentPage) */
    },
    gotoround1(index, row) {
      const courseid = row.id;
      const round = row.ground;
      const limit = row.limit;
      const groupid = this.$route.params.groupid;
      if (row.ground == 1 && (row.status == 3 || row.status == 4 || row.status == 5)) {
        this.$router.push({
          name: "round1",
          params: { courseid, round, limit, groupid }
        });
      } else {
        this.$router.push({
          name: "studentdetails",
          params: { courseid, groupid }
        });
      }
    },
    gotoround2(index, row) {
      const courseid = row.id;
      const round = row.ground;
      const limit = row.limit;
      const groupid = this.$route.params.groupid;
      if (row.ground == 2 && (row.status == 3 || row.status == 4 || row.status == 5)) {
        this.$router.push({
          name: "round2",
          params: { courseid, round, limit, groupid }
        });
      } else {
        this.$router.push({
          name: "studentdetails2",
          params: { courseid, groupid }
        });
      }
    },
    gotoround3(index, row) {
      const courseid = row.id;
      const round = row.ground;
      const limit = row.limit;
      const groupid = this.$route.params.groupid;
      if (row.ground == 3 && (row.status == 3 || row.status == 4 || row.status == 5)) {
        this.$router.push({
          name: "round3",
          params: { courseid, round, limit, groupid }
        });
      } else {
        this.$router.push({
          name: "studentdetails3",
          params: { courseid, groupid }
        });
      }
    },
    gotoround4(index, row) {
      const courseid = row.id;
      const round = row.ground;
      const limit = row.limit;
      const groupid = this.$route.params.groupid;
      if (row.ground == 4 && (row.status == 3 || row.status == 4 || row.status == 5)) {
        this.$router.push({
          name: "round4",
          params: { courseid, round, limit, groupid }
        });
      } else {
        this.$router.push({
          name: "studentdetails4",
          params: { courseid, groupid }
        });
      }
    }
  },
  created() {
    this.groupid = this.$route.params.groupid;
    console.log(this.groupid);
    this.$axios({
      method: "get",
      url: "api/v1/teacher/groups/" + this.groupid + "/courses",
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => {
        this.list = res.data;
        console.log(this.list);
      })
      .catch(error => {
        console.log(error);
        alert("错误2");
      });
  }
};
</script>
<style scoped>
/deep/ .el-table thead {
  color: #222222;
}
.fncourse {
  width: 100%;
  height: 100%;
  position: relative;
}
.fncourse-title {
  width: 100%;
  margin-left: 6%;
  height: 50px;
  padding-left: 30px;
  /*border-bottom: 1px solid #ddd;*/
}
.fncourse-table {
  width: 80%;
  padding: 20px;
  line-height: 10px;
  display: inline-block;
}
.fncourse-title-icon {
  float: left;
  width: 4px;
  height: 16px;
  margin-top: 18px;
  background-color: #00a1d6;
  border-radius: 4px;
}
.fncourse-title-text {
  float: left;
  margin: 15px 0 0 5px;
  color: #00a1d6;
  font-size: 14px;
  cursor: default;
  line-height: 25px;
}
.el-breadcrumb {
  line-height: 23px;
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
