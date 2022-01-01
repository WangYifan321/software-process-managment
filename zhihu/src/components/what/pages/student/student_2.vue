<template>
  <div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-head"
      mode="horizontal"
      @select="handleSelect"
      background-color="#222"
      text-color="gray"
      active-text-color="white"
    >
      <el-menu-item disabled style = "font-size:20px;background-color: #222" id="title"><strong style="margin-left: -8px;color: rgb(255 255 255)">HDU创新实践</strong></el-menu-item>
      <el-menu-item index="1" class="pc">基本信息</el-menu-item>
      <el-menu-item index="2" class="pc">查看导师</el-menu-item>
      <el-menu-item index="3" class="pc">查看结果</el-menu-item>
<!--      <el-menu-item index="4" class="pc">修改密码</el-menu-item>-->
      <el-menu-item class="pc" style="float:right; margin-right:10%">
        <el-dropdown>
           <span class="el-dropdown-link" >
             {{ name }}<i  class="el-icon-arrow-down el-icon--right"></i>
           </span>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item @click.native="goto_change_password">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="out">登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </el-menu-item>

<!--     <el-menu-item index="5" style="float:right; margin-right:10%" @click="out()" class="pc">登出</el-menu-item>-->
      <el-menu-item  disabled style="float:right; " class="button-mobile"><el-button @click="is_display_mobile()" class="button"><svg t="1637652850336" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1312" width="40" height="30"><path d="M898.8 278.4H152.8a32 32 0 0 1 0-64h746a32 32 0 0 1 0 64zM898.8 547.408H152.8a32 32 0 0 1 0-64h746a32 32 0 0 1 0 64zM898.8 816.4H152.8a32 32 0 0 1 0-64h746a32 32 0 0 1 0 64z" fill="#ffffff" p-id="1313"></path></svg></el-button></el-menu-item>
    </el-menu>
    <!--移动端抽屉-->
    <div class="content-mobile" v-bind:class="{is_display: display_mobile}">
          <el-menu
           background-color="#222"
           text-color="#9d9d9d"
           active-text-color="white"
           @select="handleSelect"
           collapse-transition="true"
           mode="vertical"

          >
            <el-menu-item index="1" class="mob"><span class="mob-text">基本信息</span></el-menu-item>
            <el-menu-item index="2" class="mob"><span class="mob-text">查看导师</span></el-menu-item>
            <el-menu-item index="3" class="mob"><span class="mob-text">查看结果</span></el-menu-item>
            <el-menu-item index="4" class="mob"><span class="mob-text">修改密码</span></el-menu-item>
            <el-menu-item index="5"  @click="out()" class="mob" style="height: 50px;margin-top: 5px"><span class="mob-text" style="height: 50px">登出</span></el-menu-item>
          </el-menu>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
export default {
  name: "student_2",
  data() {
    return {
      display_mobile: true,
      name:localStorage.getItem("name")
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      switch (key) {
        case "1":
          this.$router.push("/studentpersonal");
          this.is_display_mobile()
          break;
        case "2":
          this.$router.push("/courselist");
          this.is_display_mobile()
          break;
        case "3":
          this.$router.push("/choosencourse");
          this.is_display_mobile()
          break;
        case "4":
          this.$router.push("/change_password");
          this.is_display_mobile()
      }
    },
    out() {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          //跳转登录页面(编程式导航)
          this.$router.push("/");
    },
    goto_change_password(){
      this.$router.push("/change_password");
    },
    is_display_mobile(){
        this.display_mobile=!this.display_mobile;
    }
  },
  created() {
    // this.name=localStorage.getItem("name")
    if (localStorage.getItem("flag") == 1) {
      this.$message.error("初次登录，请修改密码！")
      this.$router.push("/change_password")
    }
  }

}
</script>

<style scoped>
html,body{
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width:100%;
}
.el-dropdown {
  color: #808080;
  font-size: 15px;
}
.el-menu-item * {
  vertical-align:
}
.el-menu-item [class^=el-icon-] {
  vertical-align: middle;
}

  .el-menu-head{
    height: 50px;
  }
.el-menu.el-menu--horizontal {
  border-bottom: solid 1px #7c7979;
}

.el-menu--horizontal > .el-menu-item {
  height: 50px;
  line-height: 50px;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 0;
}

/*手机版屏幕过小时菜单的样式*/
 .content-mobile{
   margin-right: -1px;
 }
.mob-text{
  float: left;
  margin-left: -8px;
}
.mob{
  line-height: 40px;
  height: 40px;
  background-color: #222;
}

.pc{
  background-color: #222;
}

  .button{
    padding: 0px 0px;
    background: #222;
  }

@media screen and (min-width:950px) {

  #title{
    margin-left: 10%;
  }


  .button-mobile{
    display: none;
  }
  .content-mobile{
    display: none;
  }
}

@media screen and (max-width:950px){
  .pc{
    display: none;
  }


}

  .is_display{
    display: none;
  }


</style>
