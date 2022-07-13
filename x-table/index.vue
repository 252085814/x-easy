<template>
  <!-- 主表格 -->
  <div class="x-table">
    <div class="mainBody">
      <el-table
        @selection-change="selectionChange"
        :data="data.data"
        :span-method="spanMethod"
        border
        style="width: 100%;"
        ref="mainTable"
        >
        <template slot="empty">
          <x-empty></x-empty>
        </template>
        <template slot-scope="scope">
          <el-table-column
            v-for="(col,pIndex) in currentColumns"
            :key="pIndex"
            v-bind="col"
          >
            <template v-if="col.children">
              <el-table-column
                v-for="(colChild,cIndex) in col.children"
                :key="cIndex"
                v-bind="colChild"
              ></el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <!-- <div class="pageBody" v-if="showPagination">
      <el-pagination
        background
        @size-change="getTableList"
        @current-change="getTableList"
        :current-page.sync="pageObject.current"
        :page-sizes="[10,20,30,40,50,100]"
        :page-size.sync="pageObject.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageObject.total">
      </el-pagination>
    </div> -->
    <x-pagination 
      ref="pagination"
      v-if="showPagination" 
      padding=""
      pager-count="5"
      :paginationCall="paginationCall">
    </x-pagination>
  </div>
</template>

<script>
import {getMyDict} from '@/util/dict'
export default {
  data(){
    return {
      tableData:{},
      dictMap:{}, //字典map
      currentColumns:[], //当前列属性

      pageObject:{
        size:10,
        total:0,
        current:1
      },

      selections:[], //当前选中
    }
  },

  props:{
    data:{
      type:Object,
      default(){
        return {}
      }
    },

    showPagination:{
      type:Boolean,
      default:false
    },

    spanMethod:{
      type:Function
    },

    paginationCall:{
      type:Function
    }
  },

  methods:{
    setData(dataObj,listKey='records'){
      if(!dataObj)return
      this.data.data=dataObj[listKey] || []

      if(this.showPagination){
        this.$refs.pagination.updatePagination(dataObj)
      }
    },

    getTableList(){
      if(this.paginationCall){
        this.$refs.pagination.getList()
      }
    },

    // 查找字典
    findDict(columns){
      if(!columns || columns.length<=0)return []
      // return columns
      const that=this
      let func= function(col){
        col.forEach(res=>{
          if(res.children){
            func(res.children)
          }else{
            if(res.display && res.display.type=='dict'){
              that.dictMap[res.display.dictCode]=null
            }
          }
        })
      }
      func(columns)
    },

    async getDicts(){
      if(Object.keys(this.dictMap).length>0){
        Object.keys(this.dictMap).forEach(async key=>{
          if(!this.dictMap[key]){
            let dict=await getMyDict(key)
            dict.forEach(dictRes=>{
              if(!this.dictMap[key]){
                this.dictMap[key]={}
              }
              this.dictMap[key][dictRes.value]=dictRes.label
            })
          }
        })
      }
    },


    rebuildColumnsAndRender(columns){
      if(!columns || columns.length<=0)return []
      // return columns
      const that=this
      console.log(this.dictMap)
      let func= function(col){
        col.forEach(res=>{
          if(res.children){
            func(res.children)
          }else{
            if(res.display && res.display.type=='dict'){
              if(!res.render || !res.formatter){
                res.formatter=(row)=>{
                  console.log(row)
                  return that.dictMap[res.display.dictCode][row[res.prop]]
                }
              }
            }else if(res.display && res.display.type=='options'){
              if(!res.render || !res.formatter){
                let map={}
                res.display.options.forEach(dis=>{
                  map[dis.value]=dis.label
                })
                res.formatter=(row)=>{
                  console.log(row)
                  return map[row[res.prop]]
                }
              }
            }
          }
        })
      }
      let newColumns= _.clone(columns)
      func(newColumns)

      //等待渲染,暂用
      this.interval=setInterval(() => {
        let state=false
        if(Object.keys(this.dictMap).length<=0){
          state=true
        }
        if(Object.values(this.dictMap).length>0){
          Object.values(this.dictMap).forEach(dic=>{
            if(dic!==null){
              state=true
            }
          })
        }
        if(state){
          clearInterval(this.interval)
          this.interval=null
          this.currentColumns=newColumns
        }
      }, 100);
    },

    async init(columns){
      this.findDict(columns)
      await this.getDicts()
      this.rebuildColumnsAndRender(columns)
    },

    selectionChange(vals){
      this.selections=vals
    },

    //获取选中行
    getSelections(){
      return JSON.parse(JSON.stringify(this.selections)) 
    }
  },

  watch:{
    'data.columns':{
      immediate:true,
      deep:true,
      handler(val){
        if(!val || val.length<=0)return
        this.init(val)
      }
    },

    'data.data':{
      handler(){
        this.selections=[]
      }
    }
  },

  destroyed(){
    if(this.interval){
      clearInterval(this.interval)
      this.interval=null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>