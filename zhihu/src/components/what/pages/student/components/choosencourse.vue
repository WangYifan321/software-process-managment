<template>
  <div class="choosencourse">
<!--    <div class="choosencourse-title">
      <span class="choosencourse-title-icon"></span>
      <span class="choosencourse-title-text">已选择导师</span>
    </div>-->
    <div class="choosencourse-table">
      <el-table :data="tableData"  stripe style="width: 100%">
        <el-table-column prop="teacherName" label="老师姓名" width="180"></el-table-column>
        <el-table-column prop="priority" label="志愿状况" width="180" :formatter="formatSex"></el-table-column>
        <el-table-column prop="rstatus" label="是否匹配" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.rstatus == 1" class="is">已匹配</span>
            <span v-if="scope.row.rstatus == 0">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="round" label="轮数" :formatter="getround"></el-table-column>
        <el-table-column prop="limit" label="上限人数"></el-table-column>
        <el-table-column prop="now" label="已匹配人数"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "choosencourse",
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    getround(row, column) {
      return row.round === 4 ? "额外轮" : row.round;
    },
    formatSex: function(row, column) {
      return row.priority === 1
        ? "第一志愿"
        : row.priority === 2
        ? "第二志愿"
        : row.priority === 3
        ? "第三志愿"
        : "wrong";
    }
  },
  created() {
    let header = {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json"
    };
    this.$axios({
      method: "get",
      url: "api/v1/student/results",
      headers: header
    })
      .then(res => {
        console.log(res.data);
        this.tableData = res.data;
      })
      .catch(error => {});
  }
};
</script>
<style >
.el-table thead {
  color: #222222;
}
.choosencourse {
  width: 100%;
  height: 100%;
  position: relative;
}
.choosencourse-title {
  height: 50px;
  padding-left: 30px;
  border-bottom: 1px solid #ddd;
}
.choosencourse-table {
  margin: 0 auto;
  width: 70%;
  padding: 20px;
  line-height: 10px;
}
@media screen and (max-width:1100px) {
  .choosencourse-table{
    width: 100%;
    padding-left: 0px;
    padding-right: 0px;
  }
}
.choosencourse-title-icon {
  float: left;
  width: 4px;
  height: 16px;
  margin-top: 18px;
  background-color: #00a1d6;
  border-radius: 4px;
}
.choosencourse-title-text {
  float: left;
  margin: 15px 0 0 5px;
  color: #00a1d6;
  font-size: 14px;
  cursor: default;
  line-height: 25px;
}
.is {
  color: #67c23a;
}
</style>
