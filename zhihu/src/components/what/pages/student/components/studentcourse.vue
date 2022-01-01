<template>
  <div class="teacher-details">
    <div class="teacher-details-title">
      <span class="teacher-details-title-icon"></span>
      <span class="teacher-details-title-text">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/courselist' }">导师列表</el-breadcrumb-item>
          <el-breadcrumb-item>导师详情</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>

    <div class="basic">
      <div class="basic_left">
        <el-form size="medium" ref="form">
          <el-form-item >{{ form.teacherName }}<div
            class="teacher-details-choosebtn"
            v-if="this.form.status===0?0:
                this.form.status===2?0:this.form.status===3?0:
                this.form.status===4?0:this.form.courseStatus===1?0:
                this.$route.params.nowChoosen===form.id?0:
                this.$route.params.isChoosen===0?1:0"
          >
            <el-dropdown size="small" split-button trigger="click" class="cho">
              选择此老师
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="chooseround1()">第一志愿</el-dropdown-item>
                <el-dropdown-item @click.native="chooseround2()">第二志愿</el-dropdown-item>
                <el-dropdown-item @click.native="chooseround3()">第三志愿</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div></el-form-item>
          <div  style="margin-top: 30px;">{{form.gender==1 ? "男":form.gender==0?"女":"未知"}}</div>
          <div  style="margin-top: 30px;">{{form.education}}</div>

<!--          <el-form-item style="font-size: 10px">{{form.gender==1 ? "男":form.gender==0?"女":"未知"}}</el-form-item>
          <el-form-item>{{form.education}}</el-form-item>-->

        </el-form>

      </div>
      <div class="basic_right">
          <img v-if="this.form.pic" :src="this.form.pic" class="avatar">
      </div>
    </div>


    <div id="show-des">

      <div  class="show-des-con" >
        <h3 style="margin-left: 5%"> 研究方向</h3>
        <h3>
          <div v-if="this.value.length>0" style="margin-left: 5%;margin-top: -10px">
            <el-tag v-for="(a,index) in value" :key="index" size="mini"  style="margin-right: 5px">{{a}}</el-tag>
          </div></h3>
        <h3 style="margin-left: 5%"> 个人简介</h3>

        <div v-html="teacher_info" style="margin-left: 5%;margin-bottom: 20px;"></div>
      </div>
    </div>



    <div id="show-des2"  >

      <div  class="show-des-con" >
        <h3 style="margin-left: 5%">课程概述</h3>
        <div v-html="this.course_info" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h3 style="margin-left: 5%">教学计划-大二上</h3>
        <div v-html="this.plan1" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h3 style="margin-left: 5%">教学计划-大二下</h3>
        <div v-html="this.plan2" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h3 style="margin-left: 5%">教学计划-大三上</h3>
        <div v-html="this.plan3" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h3 style="margin-left: 5%">教学计划-大三下</h3>
        <div v-html="this.plan4" style="margin-left: 5%;margin-bottom: 20px"></div>

        <h3 style="margin-left: 5%">题目参考</h3>
        <div v-html="this.question_type" style="margin-left: 5%;margin-bottom: 20px"></div>
      </div>


    </div>
    <br/>
    <br/>


<!--    <div class="teacher-details-choosebtn" v-if="this.$route.params.nowChoosen===form.id?1:0">
      <el-tag size="mini" type="success">已选择此导师</el-tag>
    </div>-->
  </div>
</template>
<script >
export default {
  name: "studentcourse",
  data() {
    return {
      value:[],
      teacher_info: '无',
      course_info:"无",
      plan1:"无",
      plan2:"无",
      plan3:"无",
      plan4:"无",
      question_type:"无",
      form: [],
      courseid: "",
      editorOption: {
        theme: "snow",
        boundary: document.body,
        placeholder: "",
        modules: {
          toolbar: [["bold"], [{ size: ["small", false, "large", "huge"] }]]
        }
      }
    };
  },
  methods: {
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
          course: this.$route.params.courseid,
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
          course: this.$route.params.courseid,
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
          course: this.$route.params.courseid,
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
    onEditorFocus(event) {
      event.enable(false);
    }, // 获得焦点事件
    handleClick4() {
      this.courseid = this.$route.params.courseid;
      let header = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      };
      this.$axios({
        method: "put",
        url: "api/v1/student/course",
        headers: header,
        data: {
          course: this.courseid
        }
      })
        .then(res => {
          this.$message.success("选择成功");
        })
        .catch(error => {
          alert("错误");
        });
    }
  },
  created() {
    this.courseid = this.$route.params.courseid;

    this.$axios({
      methods: "get",
      url: "api/v1/student/courses/" + this.courseid,
      params: {},
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => {
        console.log(res.data);
        this.form = res.data;
        //取出研究方向后，进行字符串的拆分
        let tmp = this.form.specialty
        if(tmp!=='')
          this.value=tmp.split(";")
        if(this.value.length===0){
          this.value[0]='无'
        }
        //取出教师描述后对教师的信息进行字符串的切割
        let des
        console.log(this.form.description)
        if(this.form.description!==''){
          des=this.form.description.split("-----")
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
          }
      }})
      .catch(error => {
        console.log(error);
        alert("错误");
      });
  }
};
</script>

<style >
.cho:hover{

}
.avatar {
  width: 150px;
  height: 190px;
  display: block;
}
@media screen and (min-width:1050px) {
  .teacher-details-choosebtn {
    margin-right: 50px;
    margin-top: -5px;
    float: right;
    z-index: 100;
  }
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 70%;
    margin-left: 15%;
    height: 250px;
    margin-top: 30px;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
  }

  .basic_left {
    width: 40%;
    float: left;
    text-align: left;
    margin-left: 5%;
    margin-top: 48px;
  }

  .basic_right {
    margin-right: 30px;
    float: right;
    margin-top: 30px;
    text-align: left;
  }
  .el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label {
    font-size: 30px;
  }

  /deep/.basic_left .el-form-item--medium .el-form-item__content {
    font-size: 10px;
    line-height: 40px;
  }
  .show-des-con{
    white-space: pre-line;
    border: 0.5px solid rgb(218, 215, 215);
    width: 70%;text-align: left;
    height: auto;
    background-color: #ffffff;
    margin: 50px auto 0;
    border-radius: 25px;
  }
}
@media screen and (max-width:1050px) and (min-width: 950px){
  .teacher-details-choosebtn {
    margin-right: 50px;
    margin-top: -5px;
    float: right;
    z-index: 100;
  }
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 76%;
    height: 250px;
    margin: 50px auto 0;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
  }
  .basic_left {
    width: 40%;
    float: left;
    text-align: left;
    margin-left:5%;
    margin-top:48px;
  }
  .basic_right {
    margin-right: 40px;
    float: right;
    margin-top:30px;
    text-align: left;
  }
  .el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label {
    font-size: 30px;
  }
  /deep/.basic_left .el-form-item--medium .el-form-item__content{
    font-size: 30px;
    line-height: 40px;
  }
  .show-des-con{
    white-space: pre-line;
    border: 0.5px solid rgb(218, 215, 215);
    width: 76%;text-align: left;
    height: auto;
    background-color: #ffffff;
    margin: 50px auto 0;
    border-radius: 25px;
  }
}


@media screen and (max-width:950px) and (min-width: 760px){
  .teacher-details-choosebtn {
    margin-right: 50px;
    margin-top: -5px;
    float: right;
    z-index: 100;
  }
  .teacher-details-title {
    display: none;
  }
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 95%;
    height: 250px;
    margin: 50px auto 0;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
  }
  .basic_left {
    width: 40%;
    float: left;
    text-align: left;
    margin-left:5%;
    margin-top:42px;
  }
  .basic_right {
    margin-right: 40px;
    float: right;
    margin-top:30px;
    text-align: left;
  }
  .el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label {
    font-size: 30px;
  }
  .basic_left .el-form-item--medium .el-form-item__content{
    font-size: 30px;
    line-height: 40px;
  }
  .show-des-con{
    white-space: pre-line;
    border: 0.5px solid rgb(218, 215, 215);
    width: 95%;text-align: left;
    height: auto;
    background-color: #ffffff;
    margin: 50px auto 0;
    border-radius: 25px;
  }
}


@media screen and (max-width: 760px) and (min-width: 300px){
  .teacher-details-choosebtn {
    margin-right: 50px;
    margin-top: -2px;
    float: right;
    z-index: 100;
  }
  .teacher-details-title {
    display: none;
  }
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 90%;
    height: 350px;
    margin: 20px auto 0;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
  }
  .basic_left {
    width: 100%;
    text-align: left;
    margin-left:5%;
  }
  .basic_right {
    margin-top: 10px;
    width: 100%;
    text-align: left;
    margin-left: 5%;
  }
  .el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label {
    font-size: 15px;
    font-weight: 1000;
    color:#2c3e50;
  }
  .basic_left .el-form-item--medium .el-form-item__content{
    font-size: 20px;
    font-weight: 1000;
  }
  .el-form-item{
    margin-bottom: 0px;
  }

  .show-des-con{
    white-space: pre-line;
    border: 0.5px solid rgb(218, 215, 215);
    width: 90%;text-align: left;
    height: auto;
    background-color: #ffffff;
    margin: 50px auto 0;
    border-radius: 25px;
  }
}


@media screen and (max-width: 300px){
  .teacher-details-choosebtn {
    margin-right: 50px;
    margin-top: -2px;
    float: right;
    z-index: 100;
  }
  .teacher-details-title {
    display: none;
  }
  .avatar-uploader{
    float: left;
  }
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 90%;
    height: 330px;
    margin: 20px auto 0;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
  }
  .basic_left {
    width: 100%;
    text-align: left;
    margin-left:5%;
  }
  .basic_right {
    margin-top: 10px;
    width: 100%;
    text-align: left;
    margin-left: 5%;
  }
  .el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label {
    font-size: 15px;
    font-weight: 1000;
    color:#2c3e50;
  }
  .basic_left .el-form-item--medium .el-form-item__content{
    font-size: 20px;
    font-weight: 1000;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
  .show-des-con{
    white-space: pre-line;
    border: 0.5px solid rgb(218, 215, 215);
    width: 90%;text-align: left;
    height: auto;
    background-color: #ffffff;
    margin: 50px auto 0;
    border-radius: 25px;
  }

}
.teacher-details {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: relative;
}

.teacher-details-title {
  margin-left: 6%;
  height: 50px;
  padding-left: 30px;
}
.teacher-details-title-icon {
  float: left;
  width: 4px;
  height: 16px;
  margin-top: 18px;
  background-color: #00a1d6;
  border-radius: 4px;
}
.teacher-details-title-text {
  float: left;
  margin: 15px 0 0 5px;
  color: #00a1d6;
  font-size: 14px;
  cursor: default;
  line-height: 25px;
}


</style>
