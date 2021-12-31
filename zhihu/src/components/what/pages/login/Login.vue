<!--18052003
10000-->
<template>
  <div id="login">
    <div id="bgd">

      <!--<div class="slide">
        <div class="slideshow">
            <transition-group tag="ul" name="image">
              <li v-for="(img, index) in imgArray" v-show="index===mark" :key="index">
                <a href="#">
                  <img :src='img'>
                </a>
              </li>
            </transition-group>
        </div>
        <div class="bar">
          <span v-for="(item, index) in imgArray" :class="{ 'active':index===mark }" :key="index"></span>
        </div>
      </div>-->
      <div id="loginBox">
        <h4>登录</h4>
        <el-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginForm"
          label-width="0px"
        >
          <el-form-item
            label=""
            prop="userName"
            style="margin-top:40px;"
            class="login-username"
          >

            <el-row>
              <el-col :span='2'>
                <span class="el-icon-user"></span>
              </el-col>
              <el-col :span='22'>
                <el-input
                  class="inps"
                  placeholder='用户名'
                  v-model="loginForm.userName"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            label=""
            prop="passWord"
          >
            <el-row>
              <el-col :span='2'>
                <span class="el-icon-s-goods"></span>
              </el-col>
              <el-col :span='22'>
                <el-input
                  class="inps"
                  placeholder='密码'
                  v-model="loginForm.passWord"
                  type='password'
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item style="margin-top:55px;">
            <el-button
              type="primary"
              plain
              class="submitBtn"
              v-on:click="checkin"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script>
import { mapMutations } from 'vuex';
export default {
  name:'slider',
  data() {
    return {
      mark:0,
      /*imgArray: [
        './static/1.jpg',
        './static/timg.jpg',
        './static/autumn.jpg',
        './static/winter.jpg'
      ],*/
      currentIndex:1,
      distance:-600,
      loginForm: {
        userName: "",
        passWord: ""
      },
      loginRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },

 methods: {
    ...mapMutations(['changeLogin']),
        checkin(){
					let _this=this;
						let headers={'Content-Type':'application/json'}
					if (this.userName== '' || this.passWord == '') {

         this.$message({
                message: '账号或密码不能为空',
                type: 'warning'
            });
					}
				else{
						this.$axios({
							method:'post',
							url:'api/v1/auth/signin',
							data:{
								'username':this.loginForm.userName,
								'password':this.loginForm.passWord

						},headers})
						.then((res)=>{
							console.log(res.data);
                _this.userToken = 'Bearer ' + res.data.token;
                _this.role=res.data.role
                _this.username =this.loginForm.userName;
                console.log(_this.username)
                let flag=res.data.flag
                localStorage.setItem('token',_this.userToken);
                localStorage.setItem('username',_this.username);
                localStorage.setItem('flag',flag);
                //_this.changeLogin({ Authorization: _this.userToken });
                if(_this.role==2)
                {
                 _this.$router.push({name:'person', params: {flag}})
                }
                if(_this.role==3)
                {

                  _this.$router.push({name:'studentpersonal', params: {flag}})
                }
                 console.log(	_this.userToken);
                 console.log(	_this.role);

						})
						.catch((error) => {
           this.$message({
                message: '账号或密码错误',
                type: 'warning'
            });
          console.log(error);
		});

				}
				},
    autoPlay () {
      this.mark++;
      if (this.mark === 4) { //当遍历到最后一张图片置零
        this.mark = 0
      }
    },
    play () {
      setInterval(this.autoPlay, 3500)
    },
    change (i) {
      this.mark = i
    }
  },
  created () {
    this.play()
  }
};
</script>

<style lang='less' scoped>
html,body{
        /*设置内部填充为0，几个布局元素之间没有间距*/
        padding: 0px;
         /*外部间距也是如此设置*/
        margin: 0px;
        /*统一设置高度为100%*/
        height: 100%;
    }
#login {
  width: 100%;
  padding: 0;
  margin: 0;
  height: 100vh;
  font-size: 16px;
  background-repeat: no-repeat;
  background-position: left top;
  background-color:#909399;
  color: #fff;
  font-family: "Source Sans Pro";
  background-size: 100% 100%;
  position: relative;
  background-size:cover
  #bgd {
    background-size: 100% 100%;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-size:cover
  }
  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  /deep/.el-form-item__error{
    color: #F56C6C;
    font-size: 12px;
    line-height: 0;
    padding-top: 4px;
    position: absolute;
    top: 90%;
    left: 0;
  }
  .slide {
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    margin-top: 0px;
    overflow: hidden;
    position: relative;
  }
  .slideshow {
    width: 100vw;
    height: 100vh;
  }
  li {
    position: absolute;
  }
  img {
    width: 100vw;
    height: 100vh;
  }
  .bar {
    position: absolute;
    width: 100%;
    bottom: 10px;
    margin: 0 auto;
    z-index: 10;
    text-align: center;
  }
  .bar span {
    width: 20px;
    height: 5px;
    border: 1px solid;
    background: white;
    display: inline-block;
    margin-right: 10px;
  }
  .active {
    background: red !important;
  }
  .image-enter-active {
    transform: translateX(0);
    transition: all 1.5s ease;
  }
  .image-leave-active {
    transform: translateX(-100%);
    transition: all 1.5s ease;
  }
  .image-enter {
    transform: translateX(100%);
  }
  .image-leave {
    transform: translateX(0);
  }
  #loginBox {
    width: 240px;
    height: 280px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 50px 40px 40px 40px;

    opacity: 1;
    background: #606266;


    /deep/ .inps input {
      border: none;
      color: #fff;
      background-color: transparent;
      font-size: 12px;
    }
    .submitBtn {

      width: 200px;
      padding:5px;
    }
    .iconfont {
      color: #fff;
    }
  }
}
</style>


