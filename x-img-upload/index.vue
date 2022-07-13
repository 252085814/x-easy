<template>
  <div>
    <el-upload
      v-bind="$attrs"
      v-on="$listeners"
      :headers="headers"
      action="/api/blade-resource/oss/endpoint/put-file-attach"
      :list-type="listType"
      :file-list="fileListFormat"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from '@/util/auth';
import website from '@/config/website';
import {Base64} from 'js-base64';
export default {
  data(){
    return {
      headers:{},
      dialogVisible:false,
      fileList:[],
      fileListFormat:[]
    }
  },

  props:{
    value:{
      type:[Array,String],
      default(){
        return []
      }
    },

    limit:{
      type:Number,
      default:1
    },

    listType:{
      type:String,
      default:'picture-card'
    }
  },

  watch:{
    value:{
      deep:true,
      immediate:true,
      handler(val){
        if(typeof(val)=='string'){
          this.fileList=[]
        }else{
          this.fileList=val
          this.fileListFormat=val.map(res=>{
            return {
              url:res
            }
          })
        }
      }
    }
  },

  // computed:{
  //   fileListFormat(){
  //     return this.fileList.map(res=>{
  //       return {
  //         url:res
  //       }
  //     })
  //   }
  // },

  created(){
    this.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`
    this.headers[website.tokenHeader] = 'bearer ' + getToken()
  },

  methods:{
    handleRemove(file, fileList) {
      try {
        // let urls=fileList.map(res=>res.response.data.link)
        // this.fileList=urls
        if(this.fileList.length){
          this.fileList.pop() //移除最后一个
        }
        // this.$emit('update:value',this.fileList)
      } catch (error) {
        console.log(error)
      }
    },
    handleSuccess(file, fileList) {
      try {
        if(this.fileList.length===this.limit){
          this.fileList.pop() //移除最后一个
        }
        let url=fileList.response.data.link
        this.fileList.push(url)
        // this.$emit('update:value',this.fileList)
      } catch (error) {
        console.log(error)
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  }
}
</script>

<style>

</style>