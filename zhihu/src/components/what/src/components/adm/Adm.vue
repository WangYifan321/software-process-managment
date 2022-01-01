<template>
  <div class="homeBox">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside height="100%" width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-active="this.$route.path" router>
          <el-menu-item index="/group/Group">
            <template slot="title">
              <i class="el-icon-help"></i>学院和年级管理
            </template>
          </el-menu-item>
          <el-menu-item index="/view/Group_choose">
            <template slot="title">
              <i class="el-icon-user"></i>用户查看
            </template>
          </el-menu-item>
          <el-menu-item index="/result/Group_choose2">
            <template slot="title">
              <i class="el-icon-document"></i>互选结果
            </template>
          </el-menu-item>
          <el-menu-item index="/course/Group_choose3">
            <template slot="title">
              <i class="el-icon-reading"></i>课程查看
            </template>
          </el-menu-item>
          <el-menu-item index="/setting/Setting">
            <template slot="title">
              <i class="el-icon-setting"></i>用户设置
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <router-view></router-view>
    </el-container>
  </div>
</template>

<style>
html,
body,
#app,
.homeBox,
.el-container {
  padding: 0px;
  margin: 0px;
  height: 100%;
}

.el-aside {
  color: #333;
}
</style>

<script>
export default {};
</script>
