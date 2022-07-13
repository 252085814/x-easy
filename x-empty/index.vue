<template>
  <div class="empContent display-flex-column display-flex-align-center">
    <img class="noDataPic" src="../static/noData.png" alt="">
    <span>{{emptyText}}</span>
  </div>
</template>

<script>
export default {
  props:{
    emptyText:{
      type:String,
      default:'暂无数据'
    }
  }
}
</script>

<style lang="scss" scoped>
.empContent{
  .noDataPic{
    width: 130px;
    height: auto;
  }
  span{
    line-height: 60px;
    color: #909399;
    font-size: 12px;
  }
}
</style>