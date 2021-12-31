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
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :http-request="uploadImg"
          :before-upload="beforeAvatarUpload">
          <img v-if="this.form.pic" :src="this.form.pic" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
<!--        <div class="personal-pic" style="float: right;margin-right: 20px;">-->
<!--          <el-image v-if="this.form.pic" class="head-img" :src="this.form.pic"></el-image>-->
<!--        </div>-->
      </div>
    </div>
    <div class="resume">
      <el-button class="resume-el-button" id='con' icon="el-icon-circle-plus" @click="showHide()" style="display: none">添加个人简历</el-button>
    </div>

    <div id="input-des" style="display: none">
      <div style="width: 100%;display: inline-block">
      <div style="float: left;margin-left: 3%;margin-top: 25px">性别</div>
      <el-select v-model="form.gender"  size="small" style="
    margin-top: 20px;
    margin-left: 2.5%;
    float: left;
    width: 65px;
">
        <el-option
          v-for="item in genders"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <div style="float: left;margin-left: 10%;margin-top: 25px">学历</div>
      <el-select v-model="form.education"  size="small" style="
    margin-top: 20px;
    margin-left: 3%;
    float: left;
    width: 120px;
">

        <el-option
          v-for="item in educations"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </div>
      <div style="float: left;margin-left: 3%;margin-top: 20px;">研究方向</div>

      <el-select v-model="value" multiple placeholder="请选择研究方向" style="
    margin-top: 20px;
    margin-left: 2.5%;
    float: left;
    width: 95%;
">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div style="float: left;margin-left: 3%;margin-top: 25px">编辑个人简历</div>
      <el-input type="textarea" placeholder="基本信息、科研项目、指导本科生的科研成果等" :rows="8" maxlength="3000" show-word-limit="1000" id='input' v-model="teacher_info" style="text-align: left;margin-top: 20px;width: 95%;"></el-input>


      <div style="margin-top: 20px;height: 55px">
        <el-button type="primary" style="float: right;margin-right: 3%" @click="save1">保存</el-button>
        <el-button type="info" plain style="float: right;margin-right: 3%" @click="buttonCancle">取消</el-button>
      </div>


    </div>


    <div id="show-des" style="display: none;">

      <div  @click="showHide()" class="show-des-con" >
        <h3 style="margin-left: 5%"> 研究方向</h3>
        <h3>
          <div v-if="this.value.length>0" style="margin-left: 5%;margin-top: -10px">
            <el-tag v-for="(a,index) in value" :key="index" size="mini"  style="margin-right: 5px">{{a}}</el-tag>
          </div></h3>
        <h3 style="margin-left: 5%"> 个人简介</h3>

        <div v-html="teacher_info" style="margin-left: 5%;margin-bottom: 20px;"></div>
      </div>


    </div>
    <br>
    <div class="resume">
      <el-button class="resume-el-button" id='con2' icon="el-icon-circle-plus" @click="showHide2()" style="display: none">添加教学计划</el-button>
    </div>


    <div id="input-des2" style="display: none">

      <div style="float: left;margin-left: 3%;margin-top: 25px">课程概述</div>
      <el-input type="textarea" placeholder="" :rows="5" maxlength="1000" show-word-limit="1000"  v-model="course_info" style="text-align: left;margin-top: 20px;width: 95%;"></el-input>

      <div style="float: left;margin-left: 3%;margin-top: 25px">教学计划-大二上</div>
      <el-input type="textarea" placeholder="" :rows="4" maxlength="1000" show-word-limit="1000"  v-model="plan1" style="text-align: left;margin-top: 20px;width: 95%;"></el-input>

      <div style="float: left;margin-left: 3%;margin-top: 25px">教学计划-大二下</div>
      <el-input type="textarea" placeholder="" :rows="4" maxlength="1000" show-word-limit="1000"  v-model="plan2" style="text-align: left;margin-top: 20px;width: 95%;"></el-input>

      <div style="float: left;margin-left: 3%;margin-top: 25px">教学计划-大三上</div>
      <el-input type="textarea" placeholder="" :rows="4" maxlength="1000" show-word-limit="1000"  v-model="plan3" style="text-align: left;margin-top: 20px;width: 95%;"></el-input>

      <div style="float: left;margin-left: 3%;margin-top: 25px">教学计划-大三下</div>
      <el-input type="textarea" placeholder="" :rows="4" maxlength="1000" show-word-limit="1000"  v-model="plan4" style="text-align: left;margin-top: 20px;width: 95%;"></el-input>

      <div style="float: left;margin-left: 3%;margin-top: 25px">题目参考</div>
      <el-input type="textarea" placeholder="" :rows="4" maxlength="1000" show-word-limit="1000"  v-model="question_type" style="text-align: left;margin-top: 20px;width: 95%;"></el-input>


      <div style="margin-top: 20px;height: 55px">
        <el-button type="primary" style="float: right;margin-right: 3%" @click="save1">保存</el-button>
        <el-button type="info" plain style="float: right;margin-right: 3%" @click="buttonCancle2">取消</el-button>
      </div>


    </div>


    <div id="show-des2" style="display: none;">

      <div  @click="showHide2()" class="show-des-con" >
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
  </div>
</template>

<script>
export default {
  name: "person_2",
  data() {
    return {
      options: [{
        value: '机器学习',
        label: '机器学习'
      }, {
        value: '可视化',
        label: '可视化'
      }, {
        value: 'web开发',
        label: 'web开发'
      }, {
        value: '嵌入式',
        label: '嵌入式'
      }, {
        value: '小程序',
        label: '小程序'
      },{
        value: '数据分析',
        label: '数据分析'
      }],
      genders: [{
        value: '男',
        label: '男'
      },{
        value: '女',
        label: '女'
      },{
        value: "未知",
        label: "未知"
      }],
      educations:[{
        value: '本科'
      },{
        value: '硕士研究生'
      },{
        value: '博士研究生'
      },{
        value: '其它'
      }],
      value: [],
      form: {
        description: "",
        pic: "",
        specialty: "",
        education: "",
        gender: ""
      },
      teacher_info:"",
      course_info:"",
      plan1:"",
      plan2:"",
      plan3:"",
      plan4:"",
      question_type:""


    };
  },
  methods: {
    uploadImg(f) {
      let header = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "multipart/form-data"
      };
      let formdata = new FormData();
      formdata.append("avatar", f.file);
      this.$axios({
        method: "put",
        url: "api/v1/teacher/picture",
        headers: header,
        data: formdata
      })
        .then(res => {
          this.form.pic = res.data.data;
          location.reload()
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });

    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    showHide() {
      document.getElementById("con").style.display = "none";
      document.getElementById("input-des").style.display = "";
      document.getElementById("show-des").style.display = "none";
    },
    showHide2(){
      document.getElementById("con2").style.display = "none";
      document.getElementById("input-des2").style.display = "";
      document.getElementById("show-des2").style.display = "none";
    },
    buttonCancle(){
      this.cancle()
      location.reload()
    },
    buttonCancle2(){
      this.cancle2()
      location.reload()
    },
    cancle() {
      if(this.teacher_info===""){
        document.getElementById("input-des").style.display = "none";
        document.getElementById("show-des").style.display = "none";
        document.getElementById("con").style.display = "";

      }else{
        document.getElementById("input-des").style.display = "none";
        document.getElementById("show-des").style.display = "";
        document.getElementById("con").style.display = "none";
      }
    },
    cancle2(){
      if(this.course_info==="" && this.plan2==="" && this.plan1==="" && this.plan3==="" && this.plan4==="" && this.question_type===""){
        document.getElementById("input-des2").style.display = "none";
        document.getElementById("show-des2").style.display = "none";
        document.getElementById("con2").style.display = "";
      }else{
        document.getElementById("input-des2").style.display = "none";
        document.getElementById("show-des2").style.display = "";
        document.getElementById("con2").style.display = "none";
      }
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
      let tmp //拼接后的研究方向
      if(this.value.length>=1){
        tmp=this.value[0]
        for(let i=1;i<this.value.length;i++){
          tmp+=";"
          tmp+=this.value[i]
        }
      }
      //校验一下用户的输入不能含有”-----“
      //还没写
      let d=''
      //拼接后的教师描述，包括个人简介与教学计划等
      if(this.teacher_info!=="" || this.course_info!=="" || this.plan2!=="" || this.plan1!=="" || this.plan3!=="" || this.plan4!=="" || this.question_type!==""){
        d=d+this.teacher_info+'-----'+this.course_info+'-----'+this.plan1+'-----'+this.plan2+'-----'+this.plan3+'-----'+this.plan4+'-----'+this.question_type
      }
      let gen = this.form.gender==='男' ? 1:this.form.gender==="女"?0:3
      console.log(d)
      this.$axios({
        method: "put",
        url: "api/v1/teacher",
        headers: header,
        data: {
          pic: this.form.pic,
          specialty: tmp,
          description: d,
          gender: gen,
          education: this.form.education
        }
      })
        .then(res => {
          // if(this.form.description===""){
            // document.getElementById("input-des").style.display = "none";
            // document.getElementById("con").style.display = "";
            // document.getElementById("show-des").style.display = "none";
            this.cancle()
            this.cancle2()

          // }else{
          //   if(this.form.description.split("-----")[0]===""){
          //     document.getElementById("input-des").style.display = "none";
          //     document.getElementById("con").style.display = "";
          //     document.getElementById("show-des").style.display = "none";
          //
          //   }else{
          //     document.getElementById("input-des").style.display = "none";
          //     document.getElementById("show-des").style.display = "";
          //     document.getElementById("con").style.display = "none";
          //   }
          // }

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
      url: "api/v1/teacher",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res.data);
        this.form = res.data;
        //取出性别
        this.form.gender=res.data.gender===1 ? "男":res.data.gender===0?"女":"未知"
        //取出研究方向后，进行字符串的拆分
        let tmp = this.form.specialty
        if(tmp!=='')
        this.value=tmp.split(";")
        //取出教师描述后对教师的信息进行字符串的切割
        let des
        console.log(this.form.description)
        if(this.form.description!==''){
          des=this.form.description.split("-----")
          //旧系统如果存储过个人简介话，切割完的数组只有一项，后面的都是undefined，会变成字符存到数据库
          if(des.length===7){
          //if(des[0]!==null)
          this.teacher_info=des[0]
          //if(des[1]!==null)
          this.course_info=des[1]
          //if(des[2]!==null)
          this.plan1=des[2]
          //if(des[3]!==null)
          this.plan2=des[3]
          //if(des[4]!==null)
          this.plan3=des[4]
          //if(des[5]!==null)
          this.plan4=des[5]
          //if(des[6]!==null)
          this.question_type=des[6]
          }else if(des.length===1){
            this.teacher_info=des[0]
          }
        }

        this.cancle()
        this.cancle2()
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
.avatar-uploader{
  margin-right: 40px;
  float: right;
}

/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 190px;
  display: block;
}

.head-img{
  height: 200px;
  width: 150px;
}



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
  /deep/.el-form-item--medium .el-form-item__content, /deep/.el-form-item--medium .el-form-item__label {
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
  #input-des2{
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
  /deep/.el-form-item--medium .el-form-item__content, /deep/.el-form-item--medium .el-form-item__label {
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
  #input-des2{
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
  /deep/.el-form-item--medium .el-form-item__content, /deep/.el-form-item--medium .el-form-item__label {
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
  #input-des2{
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
    height: 280px;
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
  /deep/.el-form-item--medium .el-form-item__content, /deep/.el-form-item--medium .el-form-item__label {
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
  #input-des2{
    width: 90%;
    background-color:#f2f6fb;
    height: auto;
    margin: 50px auto 0;
    border-radius: 20px;
  }
  .avatar-uploader{
    float: left;
  }
}


@media screen and (max-width: 300px){
  .avatar-uploader{
    float: left;
  }
  .basic {
    border: 0.5px solid rgb(218, 215, 215);
    width: 90%;
    height: 280px;
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
  /deep/.el-form-item--medium .el-form-item__content, /deep/.el-form-item--medium .el-form-item__label {
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
  #input-des2{
    width: 90%;
    background-color:#f2f6fb;
    height: auto;
    margin: 50px auto 0;
    border-radius: 20px;
  }
}

</style>
