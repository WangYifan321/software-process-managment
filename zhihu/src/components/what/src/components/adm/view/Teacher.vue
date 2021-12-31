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
        <el-button
          @click.native="confirmTeacher()"
          type="primary"
          icon="el-icon-notebook-2"
          style="margin-right: 15px"
        >确认教师名单</el-button>
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
        <el-table-column prop="username" label="工号" sortable width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" width="150"></el-table-column>
        <el-table-column prop="gender" label="性别" sortable :formatter="genderFormatter" width="80"></el-table-column>
        <el-table-column prop="specialty" label="专业" width="450">
           <template slot-scope="scope" v-if="scope.row.specialty!==''">
            <el-tag v-for="(a,index) in scope.row.specialty.split(';')" :key="index" size="mini"  style="margin-right: 5px">{{a}}</el-tag>
          </template></el-table-column>
        <el-table-column prop="education" label="学历" width="110"></el-table-column>
        <el-table-column prop="isBanned" label="状态" :formatter="isBannedFormatter" width="100"></el-table-column>
        <el-table-column prop="done" label="操作" width="140">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="编辑" placement="top">
              <i class="el-icon-edit" 
                      @click="editTableData(scope.row.teacherId,
                      scope.row.name,
                      scope.row.gender)"></i>
            </el-tooltip>
            
            <!--<el-button
              size="mini"
              icon="el-icon-edit"
              @click="editTableData(scope.row.teacherId,
                      scope.row.name,
                      scope.row.gender)"
            ></el-button>-->
            <el-tooltip class="item" effect="light" content="简历" placement="top">
            <i class="el-icon-user-solid" style="margin-left:12px" @click="resume(scope.row.teacherId)"></i>
            </el-tooltip>
            <!--<el-button size="mini" type="primary" style="margin-left:10px" @click="resume(scope.row.teacherId)">简历</el-button>-->
            <el-tooltip class="item" effect="light" content="删除" placement="top">
            <i class="el-icon-delete" style="margin-left:12px" @click="handleDelete(scope.row.teacherId)"></i>
            </el-tooltip>
            <!--<el-button
              size="mini"
              type="danger"
              :disabled="scope.row.isBanned ==0?false:true"
              @click="handleDelete(scope.row.teacherId)"
            >删除</el-button>-->
            <el-tooltip class="item" effect="light" content="恢复" placement="top">
            <i class="el-icon-refresh-right" style="margin-left:12px" @click="revokeDelete(scope.row.teacherId)"></i>
            </el-tooltip>
            <!--<el-button
              size="mini"
              type="success"
              :disabled="scope.row.isBanned ==1?false:true"
              @click="revokeDelete(scope.row.teacherId)"
            >恢复</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog title="简历" :visible.sync="dialogTableVisible" width="1000px">
        <div >
          <div class="ql-editor">
            
            
        <h2 style="margin-left: 5%">个人简介</h2>
        <div v-html="this.teacher_info" style="margin-left: 5%;margin-bottom: 20px;"></div>
        
        <h2 style="margin-left: 5%">课程概述</h2>
        <div v-html="this.course_info" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h2 style="margin-left: 5%">教学计划-大二上</h2>
        <div v-html="this.plan1" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h2 style="margin-left: 5%">教学计划-大二下</h2>
        <div v-html="this.plan2" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h2 style="margin-left: 5%">教学计划-大三上</h2>
        <div v-html="this.plan3" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h2 style="margin-left: 5%">教学计划-大三下</h2>
        <div v-html="this.plan4" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h2 style="margin-left: 5%">题目参考</h2>
        <div v-html="this.question_type" style="margin-left: 5%;margin-bottom: 20px"></div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogTableVisible = false">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data1: [],
      status: "",
      teacher_info: '无',
      course_info:"无",
      plan1:"无",
      plan2:"无",
      plan3:"无",
      plan4:"无",
      question_type:"无",
      dialogTableVisible: false,
      page: 1,
      size: 50,
      loading: false,
      totalPages: "", //取后端返回内容的总页数
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
  inject: ["reload"],
  created() {
    this.getmessage();
  },
  methods: {
    editTableData(id, name, gender) {
      this.$router.push({
        path: "../adm/view/Editteacher",
        name: "Editteacher",
        query: { data: id, name1: name, gender1: gender }
      });
    },
    handleDelete(id) {
      let groupid = String(this.$route.query.data);
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("本操作将删除该教师, 是否继续?", "提示", {
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
      this.$confirm("本操作将恢复该教师, 是否继续?", "提示", {
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
    },
    resume(id) {
      this.$axios({
        methods: "get",
        url: "api/v1/admin/teachers/" + id,
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          let des
          if(res.data.description!==''){
          des=res.data.description.split("-----")
          //旧系统如果存储过个人简介话，切割完的数组只有一项，后面的都是undefined，会变成字符存到数据库
          if(des.length===7){
            if(des[0]!=="")
            this.teacher_info=des[0]
            if(des[1]!=="")
            this.course_info=des[1]
            if(des[2]!=="")
            this.plan1=des[2]
            if(des[3]!=="")
            this.plan2=des[3]
            if(des[4]!=="")
            this.plan3=des[4]
            if(des[5]!=="")
            this.plan4=des[5]
            if(des[6]!=="")
            this.question_type=des[6]
          }else if(des.length===1){
            this.teacher_info=des[0]
          }else{
        this.teacher_info='无'
        this.course_info='无'
        this.plan1='无'
        this.plan2='无'
        this.plan3='无'
        this.plan4='无'
        this.question_type='无'
        }
      }else{
        this.teacher_info='无'
        this.course_info='无'
        this.plan1='无'
        this.plan2='无'
        this.plan3='无'
        this.plan4='无'
        this.question_type='无'
      }
          this.dialogTableVisible = true;
        })
        .catch(error => {
          console.log(error);
          alert("错误");
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
      else if (row.isBanned == 1) isBannedd = "已删除";
      else isBannedd = "未激活";
      return isBannedd;
    },
    selectChanged(value) {
      this.status = value;
      this.page = 1;
      this.loading = false;
      this.totalPages = "";
      let groupid = String(this.$route.query.data);
      this.$axios({
        methods: "get",
        url: "api/v1/admin/groups/" + groupid + "/teachers",
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
          this.data1 = res.data.data;
          this.totalPages = Math.ceil(res.data.count / 50);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    },
    load() {
      //滑到底部时进行加载
      this.loading = true;
      this.page += 1; //页数+1
      this.getmessage(); //调用接口，此时页数+1，查询下一页数据
    },
    getmessage() {
      let groupid = String(this.$route.query.data);
      this.$axios({
        methods: "get",
        url: "api/v1/admin/groups/" + groupid + "/teachers",
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
    confirmTeacher() {
      let groupid = String(this.$route.query.data);
      let headers = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$confirm("本操作将确认该组教师名单, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "put",
          url: "api/v1/admin/groups/" + groupid + "/affirmance",
          headers: headers
        })
          .then(res => {
            this.$message.success("确认教师名单成功");
            this.reload();
          })
          .catch(error => {
            this.$message.error("确认教师名单失败");
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