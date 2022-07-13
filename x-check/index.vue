<template>
  <div>
    <el-radio-group
      v-if="checkType=='radio'"
      v-bind="$attrs"
      v-on="$listeners"
      v-model="currentVal">
      <el-radio
        v-for="(item) in selections"
        :key="item.value"
        :label="item.value">{{item.label}}</el-radio>
    </el-radio-group>

    <el-checkbox-group
      v-else
      v-bind="$attrs"
      v-on="$listeners"
      v-model="currentVal">
      <el-checkbox
        v-for="(item) in selections"
        :key="item.value"
        :label="item.value">{{item.label}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import {getMyDict} from '@/util/dict'
export default {
  data(){
    return{
      currentVal:null,

      selections:[]
    }
  },
  props:{
    value:{
      default:null
    },

    options:{
      type:Array,
      default(){
        return[]
      }
    },

    //字典code
    dictCode:{
      type:[String,Number],
      default:''
    },

    //提供options,dict
    type:{
      type:String,
      default:'dict'
    },

    //选择类型radio，checkbox
    checkType:{
      type:String,
      default:'radio'
    },

    //加载字典前面
    unShiftDict:{
      type:Array,
      default(){
        return []
      }
    }
  },
  mounted(){
    this.initSelections()
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
    },

    options:{
      immediate:true,
      handler(val){
        this.selections=val || []
      }
    }
  },
  methods:{
    async initSelections(){
      if(this.type==='options'){
        this.selections=this.options
      }else if(this.type==='dict'){
        let selections=await getMyDict(this.dictCode)
        this.selections=this.unShiftDict.concat(selections)
      }
    }
  }
}
</script>

<style>

</style>