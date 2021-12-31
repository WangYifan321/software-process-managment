<template>
  <div class="changepic">
    <div class="personal-title">
      <span class="personal-title-icon"></span>
      <span class="personal-title-text">更改头像</span>
    </div>
    <div class="box">
      <div class="uploadbox">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadImg"
        >
          <i class="el-icon-plus avatar-uploader-icon">选择图片</i>
        </el-upload>
      </div>
      <div class="border-line"></div>
      <div class="cur-pic">
        <el-image class="cur-img" :src="this.form.pic"></el-image>
      </div>
    </div>
    <p class="descript">请选择图片上传：上传头像图片只能是 JPG 格式!图片大小不能超过 2MB!</p>
  </div>
</template>
<script>
export default {
  name: "changepic",
  data() {
    return {
      form: {
        pic: ""
      }
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
          this.$confirm("是否确认使用此照片?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$router.push("/showpersonal");
            })
            .catch(() => {});
          this.form.pic = res.data.data;
        })
        .catch(error => {
          console.log(error);
          alert("错误");
        });
    },
    // 上传图片前的过滤
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
      })
      .catch(error => {
        console.log(error);
        alert("错误");
      });
  }
};
</script>
<style >
.changepic {
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
.box {
  position: absolute;
  text-align: center;
  width: 600px;
  left: 250px;
  top: 100px;
  padding: 80px 20px 56px;
}
.uploadbox {
  float: left;
  position: relative;
  margin-right: 40px;
  height: 200px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  line-height: 160px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
  border: 1px dashed #d9d9d9;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 120px;
  line-height: 178px;
  text-align: center;
}
.border-line {
  height: 182px;
  width: 1px;
  background: #e5e9ef;
  float: left;
}
.cur-pic {
  margin-left: 40px;
  float: left;
  width: 200px;
  height: 178px;
  position: relative;
  z-index: 100;
  border: 1px dashed #d9d9d9;
}
.cur-img {
  width: 200px;
  height: 178px;
  position: relative;
}
.descript {
  width: 550px;
  line-height: 16px;
  color: #99a2aa;
  position: relative;
  top: 330px;
  left: 250px;
}
</style>