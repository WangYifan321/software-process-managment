<template>
  <div class="personal">
    <div class="personal-title">
      <span class="personal-title-icon"></span>
      <span class="personal-title-text">我的信息</span>
    </div>
    <div class="personal-form">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="工号" placeholder="请输入内容">{{form.username}}</el-form-item>
        <el-form-item label="姓名" placeholder="请输入内容">{{form.name}}</el-form-item>
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
        <el-form-item label="学历" placeholder="请输入学历">
          <el-input v-model="form.education" class="el-input1" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="研究方向">
          <el-input v-model="form.specialty" class="el-input1" style="width:180px"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="description">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="简历" placeholder="请输入内容" class="newdes">
          <el-upload
            action="#"
            class="avatar-uploader"
            name="picture"
            :show-file-list="false"
            :http-request="Upload"
            :before-upload="beforeUpload"
          ></el-upload>
          <el-row v-loading="quillUpdateImg"></el-row>
          <quill-editor
            class="ql-editor-class1"
            ref="myQuillEditor"
            v-model="form.description"
            :options="editorOption"
            @change="onEditorChange($event)"
          ></quill-editor>
        </el-form-item>
      </el-form>
    </div>
    <!--<div class="olddescription" v-if="form.oldDescription===''?0:1">
        <el-form  ref="form" :model="form" label-width="80px" class="inner_description">
            <el-form-item label="老简历" placeholder="请输入内容" class="i_inner_description">
               <div class="ql-container ql-snow" >
                                <div class="ql-editor">
                                    <div v-html="form.oldDescription" style="cursor:default"></div>
                                </div>
                            </div>
            </el-form-item>
        </el-form>
    </div>-->
    <div class="isave">
      <el-button :plain="true" type="primary" @click="save()">立即保存</el-button>
    </div>
    <div class="personal-pic">
      <el-image v-if="this.form.pic" class="head-img" :src="this.form.pic"></el-image>

      <el-button
        type="success"
        plain
        round
        size="mini"
        class="img-button"
        @click="gotochangepic"
      >更改头像</el-button>
    </div>
  </div>
</template>
<script >
const titleConfig = [
  { Choice: ".ql-bold", title: "加粗" },
  { Choice: ".ql-italic", title: "斜体" },
  { Choice: ".ql-underline", title: "下划线" },
  { Choice: ".ql-header", title: "段落格式" },
  { Choice: ".ql-strike", title: "删除线" },
  { Choice: ".ql-blockquote", title: "块引用" },
  { Choice: ".ql-code", title: "插入代码" },
  { Choice: ".ql-code-block", title: "插入代码段" },
  { Choice: ".ql-font", title: "字体" },
  { Choice: ".ql-size", title: "字体大小" },
  { Choice: '.ql-list[value="ordered"]', title: "编号列表" },
  { Choice: '.ql-list[value="bullet"]', title: "项目列表" },
  { Choice: ".ql-direction", title: "文本方向" },
  { Choice: '.ql-header[value="1"]', title: "h1" },
  { Choice: '.ql-header[value="2"]', title: "h2" },
  { Choice: ".ql-align", title: "对齐方式" },
  { Choice: ".ql-color", title: "字体颜色" },
  { Choice: ".ql-background", title: "背景颜色" },
  { Choice: ".ql-image", title: "图像" },
  { Choice: ".ql-video", title: "视频" },
  { Choice: ".ql-link", title: "添加链接" },
  { Choice: ".ql-formula", title: "插入公式" },
  { Choice: ".ql-clean", title: "清除字体格式" },
  { Choice: '.ql-script[value="sub"]', title: "下标" },
  { Choice: '.ql-script[value="super"]', title: "上标" },
  { Choice: '.ql-indent[value="-1"]', title: "向左缩进" },
  { Choice: '.ql-indent[value="+1"]', title: "向右缩进" },
  { Choice: ".ql-header .ql-picker-label", title: "标题大小" },
  { Choice: '.ql-header .ql-picker-item[data-value="1"]', title: "标题一" },
  { Choice: '.ql-header .ql-picker-item[data-value="2"]', title: "标题二" },
  { Choice: '.ql-header .ql-picker-item[data-value="3"]', title: "标题三" },
  { Choice: '.ql-header .ql-picker-item[data-value="4"]', title: "标题四" },
  { Choice: '.ql-header .ql-picker-item[data-value="5"]', title: "标题五" },
  { Choice: '.ql-header .ql-picker-item[data-value="6"]', title: "标题六" },
  { Choice: ".ql-header .ql-picker-item:last-child", title: "标准" },
  { Choice: '.ql-size .ql-picker-item[data-value="small"]', title: "小号" },
  { Choice: '.ql-size .ql-picker-item[data-value="large"]', title: "大号" },
  { Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: "超大号" },
  { Choice: ".ql-size .ql-picker-item:nth-child(2)", title: "标准" },
  { Choice: ".ql-align .ql-picker-item:first-child", title: "居左对齐" },
  {
    Choice: '.ql-align .ql-picker-item[data-value="center"]',
    title: "居中对齐"
  },
  {
    Choice: '.ql-align .ql-picker-item[data-value="right"]',
    title: "居右对齐"
  },
  {
    Choice: '.ql-align .ql-picker-item[data-value="justify"]',
    title: "两端对齐"
  }
];

export default {
  name: "showpersonal",
  data() {
    return {
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
      activeName: "first",
      serverUrl: "http://47.114.104.158:1337/api/v1/user/picture",
      header: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "multipart/form-data"
      },
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示

      editorOption: {
        theme: "snow",
        boundary: document.body,
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["link", "image"]
            ],
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          },
          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          },
          imageDrop: true
        }
      },

      form: {
        description: "",
        pic: "",
        specialty: "",
        education: "",
        gender: 1
      },
      headUrl: ""
    };
  },
  methods: {
    gotochangepic() {
      this.$confirm("是否要保存已编辑的信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.save();
          this.$router.push("/changepic");
        })
        .catch(() => {
          this.$router.push("/changepic");
        });
    },
    onEditorChange() {
      //内容改变事件
      this.$emit("input", this.form.description);
    },

    beforeUpload(res, file) {
      this.quillUpdateImg = true;
    },

    Upload(f) {
      let vm = this;
      let quill0 = vm.$refs["myQuillEditor"].quill;
      let header = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "multipart/form-data"
      };
      let formdata = new FormData();
      formdata.append("picture", f.file);
      this.$axios({
        method: "put",
        url: "api/v1/user/picture",
        headers: header,
        data: formdata
      })
        .then(res => {
          let quillFwb = quill0;
          let pathUrl = res.data.picUrl;
          // 获取光标所在位置
          let length = quillFwb.getSelection().index;
          // 插入图片，res为服务器返回的图片链接地址
          quillFwb.insertEmbed(length, "image", pathUrl);
          // 调整光标到最后
          quillFwb.setSelection(length + 1);
          this.quillUpdateImg = false;
        })
        .catch(error => {
          console.log(error);
          this.quillUpdateImg = false;
          alert("错误");
        });
    },

    // 上传图片前的过滤

    save() {
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
        url: "api/v1/teacher",
        headers: header,
        data: {
          description: this.form.description,
          pic: this.form.pic,
          specialty: this.form.specialty,
          education: this.form.education,
          gender: this.form.gender
        }
      })
        .then(res => {
          this.$confirm("确定要保存吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "保存成功!"
              });

              //跳转登录页面(编程式导航)
              this.$router.push("/person");
            })
            .catch(() => {});
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
      })
      .catch(error => {
        console.log(error);
        alert("错误");
      });
  },
  mounted() {
    autotip: {
      document.getElementsByClassName("ql-editor")[0].dataset.placeholder = "";
      for (let item of titleConfig) {
        let tip = document.querySelector(".quill-editor " + item.Choice);
        if (!tip) continue;
        tip.setAttribute("title", item.title);
      }
    }
  }
};
</script>
<style>
/*.el-tabs__nav-scroll{
    line-height: 0px;
}
.el-tabs__content{
    height:900px;
    overflow: auto;
    position: relative;
}*/
.ql-editor-class {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 1.42;
  height: 800px;
  outline: none;
  padding: 0 !important;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  word-wrap: break-word;
}
.ql-editor-class1 {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 1.42;
  height: 800px;
  outline: none;
  padding: 0 !important;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  word-wrap: break-word;
}
.i_inner_description .el-form-item__content {
  position: absolute;
  height: 865px;
  width: 88%;
  top: 40px;
  right: 0px;
}
</style>
<style scoped>
.isave {
  position: absolute;
  left: 80px;
  top: 1300px;
}
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
.el-form {
  text-align: left;
  width: 100%;
}
.description {
  position: relative;
  height: 900px;
  width: 98%;
}
.olddescription {
  position: absolute;
  height: 900px;
  width: 50%;
  top: 390px;
  right: 0px;
}
.inner_description {
  position: absolute;
  height: 900px;
  width: 100%;
  top: 0px;
  right: 0px;
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
  padding: 20px;
  width: 70%;
  height: 300px;
}
.avatar-uploader {
  line-height: 0px;
}
.el-input1 {
  width: 50%;
}
.personal-pic {
  width: 200px;
  height: 200px;
  position: absolute;
  right: 0px;
  top: 50px;
  z-index: 100;
  border: 1px dashed #d9d9d9;
}
.head-img {
  width: 200px;
  height: 200px;
}
.img-btn {
  width: 100px;
  height: 100px;
  position: absolute;
  right: 10px;
  top: 200px;
  z-index: 100;
}
.img-button {
  width: 90px;
  height: 30px;
  position: absolute;
  right: 40px;
  top: 230px;
}
</style>
