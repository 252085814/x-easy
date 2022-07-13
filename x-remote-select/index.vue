<template>
  <el-select 
    v-bind="$attrs"
    v-on="$listeners"
    v-model="currentVal"
    :placeholder="placeholder"
    :clearable="clearable"
    filterable
    remote
    reserve-keyword
    :remote-method="remoteMethod"
    :loading="loading"
  >
    <template slot="prefix" v-if="prefixShow">
      <i class="el-icon-search"></i>
    </template>
    <el-option
      v-for="(item) in selections"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import reqRemoteSelect from '@/api/custom/remoteSelect'
export default {
  data(){
    return{
      currentVal:null,

      selections:[],
      loading: false,
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
    },

    funcKey:{
      type:String,
      default:''
    },

    prefixShow:{
      type:Boolean,
      default:false
    }
  },
  mounted(){
    this.remoteMethod('')
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
    async remoteMethod(query) {
      console.log(reqRemoteSelect)
      if(this.timeout){
        clearTimeout(this.timeout)
        this.timeout=null
      }
      this.timeout=setTimeout(async () => {
        this.loading = true;
        let data=await reqRemoteSelect[this.funcKey](query)
        this.selections=data
        this.loading = false
      }, 300)
    }
  }
}
</script>