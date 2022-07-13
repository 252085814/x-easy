<template>
  <div class="x-panel display-flex-column" :class="{'panel-shadow':shadow,'panel-border':border}">
    <div class="x-panel-top display-flex" v-if="title!==null">
      <slot name="header-left"></slot>
      <div class="f-s-14 f-w-bold flex-1">{{title}}</div>
      <slot name="header-right"></slot>
    </div>
    <div class="x-panel-body flex-1">
      <slot></slot>
    </div>
    <div class="x-panel-bottom display-flex" v-if="bottomTitle!==null">
      <slot name="footer-left"></slot>
      <div class="f-s-14 f-w-bold flex-1">{{bottomTitle}}</div>
      <slot name="footer-right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name:'x-panel',
  data(){
    return {

    }
  },
  props:{
    title:{
      type:[String,Object],
      default:null
    },

    bottomTitle:{
      type:[String,Object],
      default:null
    },

    shadow:{
      type:Boolean,
      default:false
    },

    border:{
      type:Boolean,
      default:true
    },
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
  .panel-border{
    border: 1px solid #ebeef5;

    .x-panel-top{
      padding:16px 16px;
      border-bottom: 1px solid #E8E8E8;
    }
    .x-panel-bottom{
      padding:16px 16px;
      border-top: 1px solid #E8E8E8;
    }
    .x-panel-body{
      padding:16px;
      overflow: auto;
    }
  }
  .x-panel-top{
    padding:0;
    padding-bottom:16px;
    border-bottom: 1px solid #E8E8E8;
  }
  .x-panel-bottom{
    padding:0;
    padding-top:16px;
    border-top: 1px solid #E8E8E8;
  }
  .x-panel-body{
    padding:16px;
    padding-bottom:0;
    overflow: auto;
  }
  .x-panel+.x-panel{
    margin-top:12px;
  }
  .x-panel{
    border-radius: 2px;
    background: white;

    
    
  }
  .panel-shadow{

  }
</style>