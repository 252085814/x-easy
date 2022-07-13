<template>
  <el-cascader
    ref="cas"
    v-bind="$attrs"
    v-on="$listeners"
    v-model="currentVal"
    :placeholder="placeholder"
    :options="options"
    :clearable="clearable">
  </el-cascader>
</template>

<script>
// import {getMyDict} from '@/util/dict'
import areaData from './area'
export default {
  data(){
    return{
      currentVal:null,

      options:[]
    }
  },
  props:{
    value:{
      default:null
    },

    placeholder:{
      type:String,
      default:'请选择'
    },

    clearable:{
      type:Boolean,
      default:true
    }
  },
  mounted(){
    // this.initArea()
    this.filterArea()
  },
  watch:{
    currentVal:{
      handler(val){
        this.$emit('update:value',val)
      }
    },

    value:{
      immediate:true,
      handler(val){
        this.currentVal=val
      }
    }
  },
  methods:{
    getCheckedNodes(){
      return this.$refs.cas.getCheckedNodes()
    },

    filterArea(){
      areaData.forEach(item => {
        if(item.children){
          item.children.forEach(chi=>{
            if(chi){
              delete chi.children
            }
          })
        }
      })
      this.options=areaData
    }
  }
}
</script>