<template>
  <div class="x-step-win display-flex-column flex-1">
    <div class="swin-body display-flex-column flex-1">
      <el-carousel class="display-flex-column flex-1" height="100%" ref="carousel" :autoplay="false" indicator-position="none" arrow="never">
        <el-carousel-item v-for="index in stepNum" :key="index" style="overflow:auto;">
          <slot class="display-flex-column flex-1" :name="`carousel-${index}`"></slot>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="swin-footer p-t-16 p-b-16">
      <div class="m-l-16 m-r-16">
        <el-button type="primary" v-show="showPre" @click="toPre">上一步</el-button>
        <el-button type="primary" v-show="showNext" @click="toNext" :loading="nextLodding">下一步</el-button>
        <el-button type="primary" v-show="showSubmit" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'x-step-win',
  data(){
    return {
      index:1,

      nextLodding:false
    }
  },
  props:{
    stepNum:{
      type:Number,
      default:0
    },

    nextLogic:{
      type:Function
    },

    preLogic:{
      type:Function
    },

    isSubmit:{
      default:true
    }
  },
  computed:{
    showPre(){
      return this.index!==1
    },
    showNext(){
      return this.index!==this.stepNum
    },
    showSubmit(){
      return this.index===this.stepNum && this.isSubmit
    }
  },
  methods:{
    toPre(){
      this.index--
      this.$refs.carousel.setActiveItem(this.index-1)
    },
    // 下一步
    toNext(){
      const that=this
      this.nextLodding=true
      let func=function(state){
        that.nextLodding=false
        if(!state)return
        that.index++
        that.$refs.carousel.setActiveItem(that.index-1)
      }
      if(this.nextLogic){
        return this.nextLogic(func)
      }
      func()
    },
    submit(){
      this.$emit('carousel-submit')
    }
  }
}
</script>

<style lang="scss" scoped>
.x-step-win{
  .swin-body{
    margin-bottom:58px;
  }
  .swin-footer{
    background: white;
    width:100%;
    text-align: right;
    position: absolute;
    left:0;
    bottom:0;
    z-index: 2;
  }
}
</style>