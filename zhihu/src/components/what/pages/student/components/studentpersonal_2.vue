<template>
  <div>
    <div class="basic">
      <div class="basic_left">
        <el-form size="medium" :model="form">
          <el-form-item >{{ form.name }}</el-form-item>
          <el-form-item>{{form.username}}</el-form-item>
        </el-form>
      </div>
      <div class="basic_right">
        <el-form size="medium" :model="form">
          <el-form-item label="当前轮次">{{form.ground==4 ? "额外轮":form.ground}}</el-form-item>
          <el-form-item label="轮数状态">
            {{form.status==0 ? "尚未开始":form.status==1?"学生选择教师阶段":form.status==2?"学生选择教师已结束":
            form.status==3 ?"教师选择学生进行中":"教师选择学生已结束"}}
          </el-form-item>
          <el-form-item label="本轮开始时间">{{form.starttime}}</el-form-item>
          <el-form-item label="本轮截止时间">{{form.endtime}}</el-form-item>
        </el-form>
      </div>
    </div>
    <div class="resume">
      <el-button class="resume-el-button" id='con' icon="el-icon-circle-plus" @click="showHide()" style="display: none">添加个人简历</el-button>
    </div>

    <div id="input-des" style="display: none">
      <div style="float: left;margin-left: 3%;margin-top: 25px">编辑个人简历</div>
      <el-input type="textarea" :rows="8" maxlength="1000" show-word-limit="1000" id='input' v-model="form.description" style="text-align: left;margin-top: 20px;width: 95%;"></el-input>
      <div style="margin-top: 20px;height: 55px">
        <el-button type="primary" style="float: right;margin-right: 3%" @click="save1">保存</el-button>
        <el-button type="info" plain style="float: right;margin-right: 3%" @click="buttonCancle">取消</el-button>
      </div>


    </div>


    <div id="show-des" style="display: none;">

        <div  @click="showHide()" class="show-des-con" >
          <h3 style="margin-left: 5%"> 个人简介</h3>
          <div style="margin-left: 5%;margin-bottom: 20px">{{this.form.description}}</div>
        </div>


    </div>

    <br>
    <br>
  </div>
</template>

<script>
export default {
  name: "studentpersonal_2",
  data() {
    return {
      form: {
        description: "",
        starttime: "",
        endtime: "",
        username: "",
        gender: 1
      },

    };
  },
  methods: {
    showHide() {
      document.getElementById("con").style.display = "none";
      document.getElementById("input-des").style.display = "";
      document.getElementById("show-des").style.display = "none";
    },
    buttonCancle(){
      this.cancle()
      location.reload()
    },
    cancle() {
      if(this.form.description===""){
        document.getElementById("input-des").style.display = "none";
        document.getElementById("show-des").style.display = "none";
        document.getElementById("con").style.display = "";

      }else{
        document.getElementById("input-des").style.display = "none";
        document.getElementById("show-des").style.display = "";
        document.getElementById("con").style.display = "none";
      }
    },
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
          if(this.form.description===""){
            document.getElementById("input-des").style.display = "none";
            document.getElementById("con").style.display = "";
            document.getElementById("show-des").style.display = "none";

          }else{
            document.getElementById("input-des").style.display = "none";
            document.getElementById("show-des").style.display = "";
            document.getElementById("con").style.display = "none";
          }
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
          this.cancle()
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    },
  mounted() {

  }

}
</script>

<style scoped>




.show-des-con:hover{
  background-color: rgb(242, 246, 251);
  cursor: pointer
}

@media screen and (min-width:1050px) {
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 70%;
    margin-left: 15%;
    height: 250px;
    margin-top: 50px;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
  }
  .basic_left {
    width: 20%;
    float: left;
    text-align: left;
    margin-left:5%;
    margin-top:65px;
  }
  .basic_right {
    width: 50%;
    float: right;
    margin-top:30px;
    text-align: left;
  }

  /deep/.el-form-item--medium .el-form-item__content {
    font-size: 20px;
    line-height: 30px;
    color:#2c3e50;
  }
  /deep/.basic_left .el-form-item--medium .el-form-item__content{
    font-size: 30px;
    line-height: 40px;
  }
  .resume-el-button{
    width:70%;
    height:250px;
    margin-top:50px;
    border-radius: 20px;
    font-size: 30px;
  }
  .resume-el-button:focus, .resume-el-button:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: rgb(253, 253, 250);
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

  #input-des{
    width: 70%;
    background-color:#f2f6fb;
    height: auto;
    margin: 50px auto 0;
    border-radius: 20px;
  }
}


@media screen and (max-width:1050px) and (min-width: 950px){
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 76%;
    height: 250px;
    margin: 50px auto 0;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
  }
  .basic_left {
    width: 20%;
    float: left;
    text-align: left;
    margin-left:5%;
    margin-top:65px;
  }
  .basic_right {
    width: 50%;
    float: right;
    margin-top:30px;
    text-align: left;
  }
  /deep/.el-form-item--medium .el-form-item__content {
    font-size: 20px;
    line-height: 30px;
    color:#2c3e50;
  }
  /deep/.basic_left .el-form-item--medium .el-form-item__content{
    font-size: 30px;
    line-height: 40px;
  }
  .resume-el-button{
    width:76%;
    height:250px;
    margin-top:50px;
    border-radius: 20px;
    font-size: 25px;
  }
  .resume-el-button:focus, .resume-el-button:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: rgb(253, 253, 250);
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
  #input-des{
    width: 76%;
    background-color:#f2f6fb;
    height: auto;
    margin: 50px auto 0;
    border-radius: 20px;
  }
}


@media screen and (max-width:950px) and (min-width: 760px){
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 95%;
    height: 250px;
    margin: 50px auto 0;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
  }
  .basic_left {
    width: 20%;
    float: left;
    text-align: left;
    margin-left:5%;
    margin-top:65px;
  }
  .basic_right {
    width: 50%;
    float: right;
    margin-top:30px;
    text-align: left;
  }
  /deep/.el-form-item--medium .el-form-item__content{
    font-size: 20px;
    line-height: 30px;
    color:#2c3e50;
  }
  /deep/.basic_left .el-form-item--medium .el-form-item__content{
    font-size: 30px;
    line-height: 40px;
  }
  .resume-el-button{
    width:95%;
    height:250px;
    margin: 50px auto 0;
    border-radius: 20px;
    font-size: 30px;
  }
  .resume-el-button:focus, .resume-el-button:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: rgb(253, 253, 250);
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
  #input-des{
    width: 95%;
    background-color:#f2f6fb;
    height: auto;
    margin: 50px auto 0;
    border-radius: 20px;
  }
}


@media screen and (max-width: 760px) and (min-width: 300px){
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 90%;
    height: 230px;
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
  /deep/.el-form-item{
    margin-bottom: 0px;
  }
  /deep/.el-form-item--medium .el-form-item__content {
    font-size: 15px;
    font-weight: 1000;
    color:#2c3e50;
  }
  /deep/.basic_left .el-form-item--medium .el-form-item__content{
    font-size: 20px;
    font-weight: 1000;
  }
  .resume-el-button{
    width:90%;
    height:250px;
    margin: 50px auto 0;
    border-radius: 20px;
    font-size: 25px;
  }
  .resume-el-button:focus, .resume-el-button:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: rgb(253, 253, 250);
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
  #input-des{
    width: 90%;
    background-color:#f2f6fb;
    height: auto;
    margin: 50px auto 0;
    border-radius: 20px;
  }
}


@media screen and (max-width: 300px){
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 90%;
    height: 230px;
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
  /deep/.el-form-item{
    margin-bottom: 0px;
  }
  /deep/.el-form-item--medium .el-form-item__content {
    font-size: 10px;
    color:#2c3e50;
    font-weight: 1000;
  }
  /deep/.basic_left .el-form-item--medium .el-form-item__content{
    font-size: 15px;
    font-weight: 1000;
  }
  .resume-el-button{
    width:90%;
    height:250px;
    margin: 50px auto 0;
    border-radius: 20px;
    font-size: 25px;
  }
  .resume-el-button:focus, .resume-el-button:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: rgb(253, 253, 250);
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
  #input-des{
    width: 90%;
    background-color:#f2f6fb;
    height: auto;
    margin: 50px auto 0;
    border-radius: 20px;
  }
}

</style>
