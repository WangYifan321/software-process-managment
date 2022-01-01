<template>
  <div class="course">
<!--    <div class="course-title">
      <span class="course-title-icon"></span>
      <span class="course-title-text">导师列表</span>
    </div>-->
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
        ref="filterTable"
      >
<!--        <el-table-column fixed label="序号" width="50" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>-->
<!--        <el-table-column prop="academy" label="学院" width="120"></el-table-column>
        <el-table-column prop="grade" label="年级" width="80"></el-table-column>-->
        <el-table-column prop="teacherName" label="教师姓名" width="100" sortable :sort-method="(a,b) => a.teacherName.localeCompare(b.teacherName)"></el-table-column>
        <el-table-column prop="specialty" label="研究方向" width="350"
                         :filters="[{ text: 'web',value: 'web开发' }, { text: '机器学习', value: '机器学习' }]"
                         :filter-method="filterTag"
                         filter-placement="bottom-end"
        >
          <template slot-scope="scope" v-if="scope.row.specialty!==''">
            <el-tag v-for="(a,index) in scope.row.specialty.split(';')" :key="index" size="mini"  style="margin-right: 5px">{{a}}</el-tag>
          </template>

        </el-table-column>
<!--        <el-table-column prop="ground" label="轮数" width="80" :formatter="getround"></el-table-column>
        <el-table-column prop="status" label="状态" width="130" :formatter="formatSex"></el-table-column>-->
        <el-table-column prop="limit" label="上限人数" width="80"></el-table-column>
        <el-table-column prop="now" label="已匹配人数" width="100"></el-table-column>
        <el-table-column  label="操作" width="70">
          <template slot-scope="scope">
            <el-button @click="handleClick2(scope.$index,scope.row)" type="text" size="small">详情</el-button>
            </template>
        </el-table-column>
            <!--<el-button @click="handleClick3(scope.$index,scope.row)" type="text" size="small"
               v-if="nowChoosen===scope.row.CourseId?0:isChoosen===1?0:scope.row.status===0?
               0:scope.row.status===2?0:scope.row.courseStatus===1?0:scope.row.status===3?0:scope.row.status===4?0:1"
            >选择此导师</el-button>-->

          <el-table-column label="选择" width="170">
            <template slot-scope="scope">
              <el-dropdown
                size="small"
                split-button
                trigger="click"
                v-if="scope.row.status===0?
               0:scope.row.status===2?0:scope.row.status===3?0:scope.row.status===4?0:
               scope.row.status===5?0:scope.row.status===6?0:firstChoose===scope.row.CourseId?0:
               secondChoose===scope.row.CourseId?0:thirdChoose===scope.row.CourseId?0:isChoosen===1?0:1"
              >
                选择此老师
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="chooseround1(scope.$index,scope.row)">第一志愿</el-dropdown-item>
                  <el-dropdown-item @click.native="chooseround2(scope.$index,scope.row)">第二志愿</el-dropdown-item>
                  <el-dropdown-item @click.native="chooseround3(scope.$index,scope.row)">第三志愿</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-tag size="mini" type="success" v-if="firstChoose===scope.row.CourseId?1:0">第一志愿</el-tag>
              <el-tag size="mini" type="success" v-if="secondChoose===scope.row.CourseId?1:0">第二志愿</el-tag>
              <el-tag size="mini" type="success" v-if="thirdChoose===scope.row.CourseId?1:0">第三志愿</el-tag>
            </template>
          </el-table-column>

      </el-table>
    </div>
    <!-- <p v-if="loading">加载中...</p>
    <p v-if="noMore"></p>-->
  </div>
</template>
<script >
import Teacher from "../../teacher/Teacher";
export default {
  components: {Teacher},
  inject: ["reload"],
  name: "courselist",
  data() {
    return {
      tableData: [],
      page: 1,
      size: 0,
      pagesize: 8,
      loading: false,
      totalPages: "", //取后端返回内容的总页数
    };
    isChoosen: 0;
    nowChoosen: 0;
    firstChoose: 0;
    secondChoose: 0;
    thirdChoose: 0;
    matchId: 0;
  },
  created() {
    this.getmessage();
  },
  methods: {
    filterTag(value, row) {
      return row.specialty.split(';').includes(value);
    },
    getround(row, column) {
      return row.ground === 4 ? "额外轮" : row.ground;
    },

    formatSex: function(row, column) {
      return row.status === 0
        ? "尚未开始"
        : row.status === 1
        ? "学生选择导师"
        : row.status === 2
        ? "学生选择导师已结束"
        : row.status === 3
        ? "导师选择学生"
        : "导师选择学生已结束";
    },
    handleClick2(index, row) {
      this.id = row.CourseId;
      const courseid = row.CourseId;
      const isChoosen = this.isChoosen;

      if (this.nowChoosen == this.id) {
        this.nowChoosen = this.nowChoosen;
      } else if (this.matchId == this.id) {
        this.nowChoosen = 0;
      } else {
        this.nowChoosen = 0;
      }
      this.$router.push({
        name: "studentcourse",
        params: {
          courseid: courseid,
          isChoosen: this.isChoosen,
          nowChoosen: this.nowChoosen
        }
      });
    },
    chooseround1(index, row) {
      let header = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$axios({
        method: "put",
        url: "api/v1/student/course",
        headers: header,
        data: {
          course: row.CourseId,
          priority: 1
        }
      })
        .then(res => {
          this.$message({
            message: "选择成功",
            type: "success"
          });
          this.reload();
        })
        .catch(error => {
          if (row.status === 2) {
            this.$message({
              message: "本轮导师选择已经结束",
              type: "warning"
            });
          } else {
            this.$message({
              message: "你已经被导师选择",
              type: "warning"
            });
          }
        });
    },
    chooseround2(index, row) {
      let header = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$axios({
        method: "put",
        url: "api/v1/student/course",
        headers: header,
        data: {
          course: row.CourseId,
          priority: 2
        }
      })
        .then(res => {
          this.$message({
            message: "选择成功",
            type: "success"
          });
          this.reload();
        })
        .catch(error => {
          if (row.status === 2) {
            this.$message({
              message: "本轮导师选择已经结束",
              type: "warning"
            });
          } else {
            this.$message({
              message: "你已经被导师选择",
              type: "warning"
            });
          }
        });
    },
    chooseround3(index, row) {
      let header = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$axios({
        method: "put",
        url: "api/v1/student/course",
        headers: header,
        data: {
          course: row.CourseId,
          priority: 3
        }
      })
        .then(res => {
          this.$message({
            message: "选择成功",
            type: "success"
          });
          this.reload();
        })
        .catch(error => {
          if (row.status === 2) {
            this.$message({
              message: "本轮导师选择已经结束",
              type: "warning"
            });
          } else {
            this.$message({
              message: "你已经被导师选择",
              type: "warning"
            });
          }
        });
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
        url: "api/v1/student/courses",
        params: {
          page: this.page,
          size: 250
        },
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          this.nowChoosen = res.data.nowChoosen;
          this.firstChoose = res.data.firstChoose;
          this.secondChoose = res.data.secondChoose;
          this.thirdChoose = res.data.thirdChoose;
          console.log(this.nowChoosen);
          console.log(res.data);
          this.isChoosen = res.data.isChoosen;
          this.matchId = res.data.matchId;
          this.tableData = this.tableData.concat(res.data.courses);
          this.tableData = this.tableData.filter(data => {
            //过滤掉SourceUserId这条数据
            return data.now < data.limit;
          });
          this.totalPages = Math.ceil(res.data.count / 50);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
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
<style  scoped>
.el-table thead {
  color: #222222;
}
.course {
  width: 100%;
  height: 100%;
  position: relative;
}
.course-title {
  height: 50px;
  padding-left: 30px;
  border-bottom: 1px solid #ddd;
}
.course-table {
  height: auto;
  padding: 20px;
  line-height: 10px;
  display: inline-block;
}
@media screen and (max-width:1000px){
  .course-table{
    width: 100%;
    padding-left: 0px;
    padding-right: 0px;

  }
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
</style>
