<template>
  <div class="personal">
    <div class="personal-title">
      <span class="personal-title-icon"></span>
      <span class="personal-title-text">我的信息</span>
    </div>
    <div class="personal-form">
      <el-form ref="form" :model="form" label-width="130px" :label-position="position">
        <el-form-item label="学号" placeholder="请输入内容">{{form.username}}</el-form-item>
        <el-form-item label="姓名" placeholder="请输入内容">{{form.name}}</el-form-item>
        <el-form-item label="专业">{{form.discipline}}</el-form-item>
        <el-form-item label="性别">
          <!--{{form.gender==1 ? "男":form.gender==0?"女":"未知"}}-->
          <el-select v-model="form.gender" placeholder="请选择" style="width:85px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前轮数">{{form.ground==4 ? "额外轮":form.ground}}</el-form-item>
        <el-form-item label="轮数状态">
          {{form.status==0 ? "尚未开始":form.status==1?"学生选择教师阶段":form.status==2?"学生选择教师已结束":
          form.status==3 ?"教师选择学生进行中":"教师选择学生已结束"}}
        </el-form-item>
        <el-form-item label="当前轮次开始时间">{{form.starttime}}</el-form-item>
        <el-form-item label="当前轮次截止时间">{{form.endtime}}</el-form-item>
        <el-form-item label="自我介绍">
          <el-input type="textarea" v-model="form.description" :rows="20"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save1">立即保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script >
export default {
  name: "studentpersonal",
  data() {
    return {
      form: {
        description: "",
        starttime: "",
        endtime: "",
        username: "",
        gender: 1
      },
      options: [
        {
          value: 1,
          label: "男"
        },
        {
          value: 0,
          label: "女"
        },
        {
          value: 3,
          label: "未知"
        }
      ],
      position: "left",
      formLabelWidth: "120px"
    };
  },
  methods: {
    stFormatter(starttime) {
      function formatFunc(str) {
        return str > 9 ? str : "0" + str;
      }
      var date = new Date(starttime);
      var year = date.getFullYear();
      var mon = formatFunc(date.getMonth() + 1);
      var day = formatFunc(date.getDate());
      var hour = formatFunc(date.getHours());
      var min = formatFunc(date.getMinutes());

      var dateStr = year + "-" + mon + "-" + day + "  " + hour + ":" + min;
      return dateStr;
    },
    etFormatter(endtime) {
      function formatFunc(str) {
        return str > 9 ? str : "0" + str;
      }
      var date = new Date(endtime);
      var year = date.getFullYear();
      var mon = formatFunc(date.getMonth() + 1);
      var day = formatFunc(date.getDate());
      var hour = formatFunc(date.getHours());
      var min = formatFunc(date.getMinutes());
      var dateStr = year + "-" + mon + "-" + day + "  " + hour + ":" + min;
      return dateStr;
    },
    save1() {
      // 包装成list要求的对象
      //var p = {id:this.id, fleet_name: this.fleet_name,user_id:this.user_id,status:this.status, ctime: new Date()}
      //this.list.push(p);
      // 清空文本框中的数据
      let header = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$axios({
        method: "put",
        url: "api/v1/student",
        headers: header,
        data: {
          description: this.form.description,
          gender: this.form.gender
        }
      })
        .then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
        })
        .catch(error => {
          alert("错误");
          console.log(header);
        });
    }
  },
  created() {
    this.$axios({
      methods: "get",
      url: "api/v1/student",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res.data);
        this.form = res.data;
        this.form.username = res.data.username;
        this.form.starttime = this.stFormatter(res.data.starttime);
        this.form.endtime = this.etFormatter(res.data.endtime);
        this.form.teacherStarttime = this.stFormatter(
          res.data.teacherStarttime
        );
        this.form.teacherEndtime = this.etFormatter(res.data.teacherEndtime);
      })
      .catch(error => {
        console.log(error);
        alert("错误");
      });
    console.log(this.form.description)
  }
};
</script>
<style scoped>
.personal {
  width: 100%;
  height: 100%;
  position: relative;
}
.personal-title {
  height: 50px;
  padding-left: 30px;
  border-bottom: 1px solid #ddd;
}

.personal-title-icon {
  float: left;
  width: 4px;
  height: 16px;
  margin-top: 18px;
  background-color: #00a1d6;
  border-radius: 4px;
}
.personal-title-text {
  float: left;
  margin: 15px 0 0 5px;
  color: #00a1d6;
  font-size: 14px;
  cursor: default;
  line-height: 25px;
}
.personal-form {
  text-align: left;
  width: 50%;
  height: 500px;
  padding: 20px;
}
.el-form {
  height: 500px;
}
.changepsd {
  position: relative;
  float: right;
  width: 100px;
}
</style>
