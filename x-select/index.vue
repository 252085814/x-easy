<template>
  <el-select 
    v-bind="$attrs"
    v-on="$listeners"
    v-model="currentVal"
    :placeholder="placeholder"
    :clearable="clearable"
  >
    <el-option
      v-for="(item) in selections"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
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
        this.selections=this.options || []
      }else if(this.type==='dict'){
        this.selections=await getMyDict(this.dictCode)
      }
    }
  }
}
</script>