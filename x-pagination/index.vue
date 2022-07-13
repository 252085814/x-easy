<template>
  <div class="pageBody" :style="{background:background,padding:padding}">
    <el-pagination
      background
      @size-change="getList"
      @current-change="getList"
      :current-page.sync="pageObject.current"
      :page-sizes="[10,20,30,40,50,100]"
      :page-size.sync="pageObject.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageObject.total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data(){
    return {
      pageObject:{
        size:10,
        total:0,
        current:1
      }
    }
  },

  props:{
    paginationCall:{
      type:Function
    },

    background:{
      type:String,
      default:''
    },

    padding:{
      type:String,
      default:'10px'
    }
  },

  methods:{
    updatePagination(dataObj){
      if(!dataObj)return

      this.pageObject.size=dataObj.size
      this.pageObject.current=dataObj.current
      this.pageObject.total=dataObj.total
    },

    getList(){
      if(this.paginationCall){
        this.paginationCall({
          current:this.pageObject.current,
          size:this.pageObject.size
        })
      }
    },
  }
}
</script>

<style>

</style>