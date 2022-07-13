<template>
  <div class="x-tree">
    <el-button type="primary" @click="classifyDialogShow(null,'1')" v-if="edit">新增分类</el-button>
    <el-tree
      ref="tree"
      v-bind="$attrs"
      v-on="$listeners"
      :load="loadNode"
      lazy
      :props="defaultProps"
      :key="treeKey"
      node-key="id"
      draggable>
      <template slot-scope="scope"> 
        <div class="x-tree-content display-flex-align-center flex-1" @click="nodeClick(scope)">
          <div class="flex-1">
            <p class="f-s-14 x-tree-node-title">{{`${scope.data.name}`}}</p>
            <p class="f-s-12 sub-color x-tree-node-subtitle">
              <!-- eslint-disable-next-line vue/no-parsing-error -->
              {{`子分类${scope.data.childCount?(scope.data.childCount<0?0:scope.data.childCount):0}个`}}
              <!-- {{`商品${scope.data.retailCount}个,  子分类${scope.data.childCount?(scope.data.childCount<0?0:scope.data.childCount):0}个`}} -->
            </p>
          </div>
          <i class="el-icon-caret-top orderBtn" title="上移" v-if="edit" @click.stop="nodeOrderUp(scope)"></i>
          <i class="el-icon-caret-bottom orderBtn" title="下移" v-if="edit" @click.stop="nodeOrderDown(scope)"></i>
          <i class="el-icon-edit orderBtn" title="修改" v-if="edit" @click.stop="classifyDialogShow(scope.data.id,scope.node.level,scope.data.name)"></i>
          <i class="el-icon-delete orderBtn" title="删除" v-if="edit && canDel" @click.stop="nodeDel(scope)"></i>
        </div>
      </template>
    </el-tree>

    <el-dialog
      title="新增分类"
      :visible.sync="classifyDialog.visible"
      v-if="classifyDialog.visible"
      width="500px"
      :append-to-body="true"
    >
      <div>
        <el-form ref="form" label-width="auto" :model="classifyDialog.model" :rules="classifyDialog.rules">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="classifyDialog.model.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="所属分类" prop="firstCatId" v-if="!classifyDialog.id">
            <el-select v-model="classifyDialog.model.firstCatId" placeholder="请选择">
              <el-option
                v-for="item in classifyDialog.classOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="classifyDialog.visible=false">取 消</el-button>
        <el-button type="primary" @click="classifyDialogSure"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import req from '@/api/custom/seller-manage'
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        defaultProps: {
          label: 'name',
          isLeaf: 'leaf'
        },

        merchantId:null, //商户id
        edit:false,
        treeKey:1,

        classifyDialog:{
          visible:false,
          id:'',
          type:'1',
          model:{
            name:'',
            firstCatId:''
          },
          rules:this.$common.createRules(['name']),
          classOptions:[]
        },

        //接口配置
        reqPort:{
          mt:{
            clasifyList:'clasifyList',
            classifyUp:'classifyUp',
            classifyDown:'classifyDown',
            classifyDel:'classifyDel',
            classifyEdit_first:'classifyEdit_first',
            classifyEdit_second:'classifyEdit_second',
            classifyAdd_first:'classifyAdd_first',
            classifyAdd_second:'classifyAdd_second',
          },
          jd:{
            clasifyList:'jd_clasifyList',
            classifyUp:'jd_classifyUp',
            classifyDown:'jd_classifyDown',
            classifyDel:'jd_classifyDel',
            classifyEdit_first:'jd_classifyEdit_first',
            classifyEdit_second:'jd_classifyEdit_second',
            classifyAdd_first:'jd_classifyAdd_first',
            classifyAdd_second:'jd_classifyAdd_second',
          }
        }
      }
    },
    props:{
      bussiness:{
        type:String,
        default:'mt'
      }
    },
    computed:{
      ...mapState({
        userInfo:state=>state.user.userInfo
      }),
      currentReqPort(){
        return this.reqPort[this.bussiness]
      },
      canDel(){
        return this.bussiness==='mt'
      }
    },
    created(){
      this.merchantId=this.$route.query.mId
    },
    mounted(){
      console.log(this.userInfo)
      this.getClassOptions()
    },
    methods: {
      startEdit(){
        this.edit=true
      },

      stopEdit(){
        this.edit=false
      },

      reloadTree(){
        this.treeKey++
      },

      getChildList(parentId=''){
        return req(this.currentReqPort.clasifyList,{
          parentId,
          merchantId:this.merchantId
        })
      },

      // 加载节点
      async loadNode(node, resolve) {
        console.log(node.level,node)
        if (node.level === 0) {
          let list=await this.getChildList()
          list.forEach(li => {
            li.leaf=li.childCount<=0
          })

          //默认第一个节点
          if(list.length>0){
            setTimeout(() => {
              document.querySelector('.x-tree-content').click()
            }, 500)
          }
          return resolve(list)
        }
        if (node.data.childCount<=0) return resolve([]);

        let list=await this.getChildList(node.data.id)
        list.forEach(li => {
          li.leaf=li.childCount<=0
        })
        resolve(list)
      },

      //节点点击
      nodeClick(row){
        console.log('nodeClick')
        console.log(row)
        this.$emit('nodeClick',row.data)
      },

      //节点移动顺序
      nodeOrderUp(row){
        req(this.currentReqPort.classifyUp,{
          id:row.data.id,
          merchantId:this.merchantId
        }).then(res=>{
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.reloadTree()
        })
      },

      //节点移动顺序
      nodeOrderDown(row){
        req(this.currentReqPort.classifyDown,{
          id:row.data.id,
          merchantId:this.merchantId
        }).then(res=>{
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.reloadTree()
        })
      },

      //节点删除
      nodeDel(row){
        this.$confirm('确定此操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          req(this.currentReqPort.classifyDel,{
            id:row.data.id,
            merchantId:this.merchantId
          }).then(res=>{
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.$refs.tree.remove(row.data)
          })
        }).catch(() => {

        })
      },

      async getClassOptions(){
        let list=await this.getChildList()
        this.classifyDialog.classOptions=list
      },

      classifyDialogShow(id,type,name){
        this.$common.resetObj(this.classifyDialog.model)
        this.classifyDialog.id=id
        this.classifyDialog.type=type
        this.classifyDialog.model.name=name || ''
        this.classifyDialog.visible=true
      },

      classifyDialogSure(){
        //修改
        if(this.classifyDialog.id){
          let url=this.classifyDialog.type=='1'?this.currentReqPort.classifyEdit_first:this.currentReqPort.classifyEdit_second
          let params=this.classifyDialog.type=='1'?{
            id:this.classifyDialog.id,
            name:this.classifyDialog.model.name
          }:{
            secondCatName:this.classifyDialog.model.name,
            secondCatId:this.classifyDialog.id
          }
          params.merchantId=this.merchantId

          req(url,params).then(res=>{
            this.$message.success('修改成功')
            this.reloadTree()
            this.classifyDialog.visible=false
          })
        }else{
          let url=this.classifyDialog.model.firstCatId?this.currentReqPort.classifyAdd_second:this.currentReqPort.classifyAdd_first
          let params=this.classifyDialog.model.firstCatId?{
            secondCatName:this.classifyDialog.model.name,
            firstCatId:this.classifyDialog.model.firstCatId
          }:{
            name:this.classifyDialog.model.name
          }
          params.merchantId=this.merchantId

          req(url,params).then(res=>{
            this.$message.success('新增成功')
            this.reloadTree()
             this.classifyDialog.visible=false
          })
        }
      }
    }
  };
</script>
<style>

</style>
<style lang="scss">
.x-tree{
  .x-tree-content{
    p{
      margin:0;
    }
    .x-tree-node-subtitle{
      margin-top:5px;
    }
    .orderBtn{
      padding: 5px;
    }
  }

  .el-tree-node__content{
    height: auto;
    margin-top: 16px;
  }
  .is-current>.el-tree-node__content{
    border-left: 2px solid #f89800;
    &>.x-tree-content>.x-tree-node-title{
      color:#f89800;
    }
  }
}
 
</style>