<template>
   <el-dialog
      title="选择坐标"
      v-if="mapDialog.visible"
      :visible.sync="mapDialog.visible"
      width="900px"
      :append-to-body="true"
      :before-close="dialogBeforeClose">
      <div v-loading="mapDialog.loading">
        <div>
          <el-autocomplete 
            style="width:100%"
            v-model="mapDialog.model.searchVal" 
            placeholder="请输入" 
            :fetch-suggestions="fetchSuggestions" 
            @select="handleSelect">
          </el-autocomplete>
          <div id="mapSelect"></div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="mapDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import req from '@/api/custom/merchant'
export default {
  data(){
    return {
       //地图坐标选择
      mapDialog:{
        loading:false,
        visible:false,
        map:null,
        Geocoder:null,
        lnglat:null,
        PlaceSearch:null,
        marker:null,
        model:{
          searchVal:''
        },
      },

      lnglat:null //默认中心点
    }
  },

  methods:{
    show({placeName='',lnglat=null,merchantId=null}){
      this.mapDialog.visible=true
      if(placeName){
        this.mapDialog.model.searchVal=placeName
      }
      if(lnglat){
        this.lnglat=[lnglat.lng,lnglat.lat]
      }
      this.mapDialogShow()
      this.getPolygen(merchantId)
    },
    close(){
      this.mapDialog.visible=false
    },
    sure(){
      if(!this.mapDialog.marker){
        return this.$message.warning('请先选择地点')
      }
      this.$emit('map-marker-sure',{
        lng:this.mapDialog.lnglat.getLng(),
        lat:this.mapDialog.lnglat.getLat(),
        name:this.mapDialog.marker.getLabel().content
      })
      this.mapDialog.visible=false
    },
    mapDialogShow(){
      this.mapDialog.map=null
      this.mapDialog.lnglat=null
      this.mapDialog.Geocoder=null
      this.mapDialog.PlaceSearch=null
      this.mapDialog.marker=null
      this.mapDialog.visible=true

      setTimeout(() => {
        let center=[117.000923, 36.675807]
        // 默认标记点
        if(this.lnglat){
          center=this.lnglat
        }
        AMap.plugin(["AMap.Geocoder",'AMap.PlaceSearch'], () => {
          this.mapDialog.map = new AMap.Map("mapSelect", {
            center: center,
            zoom: 16,
          })
          this.mapDialog.Geocoder=new AMap.Geocoder({})
          this.mapDialog.PlaceSearch = new AMap.PlaceSearch({
            map: this.mapDialog.map
          })
          //构造地点查询类
          // AMap.event.addListener(auto, "select", function (e) {
          //   placeSearch.setCity(e.poi.adcode);
          //   placeSearch.search(e.poi.name);  //关键字查询查询
          // })
          this.mapDialog.map.on('click', (ev)=> {
            this.mapDialog.map.clearMap()
            this.setMarker(ev.lnglat)
          })

          // 默认标记点
          if(this.lnglat){
            this.setMarker(new AMap.LngLat(this.lnglat[0],this.lnglat[1]))
          }
        })
      }, 50)
    },

    setMarker(lnglat){
      this.mapDialog.loading=true
      this.mapDialog.lnglat=lnglat
      this.mapDialog.Geocoder.getAddress(lnglat, (status, result)=> {
          this.mapDialog.loading=false
          if (status === 'complete'&&result.regeocode) {
              var address = result.regeocode.formattedAddress;
              this.mapDialog.marker=null
              this.mapDialog.marker=new AMap.Marker({
                  position: lnglat,
                  label:{
                    content:address
                  }
              })
              this.mapDialog.map.add(this.mapDialog.marker)
              this.mapDialog.model.searchVal=address
          }else{
              console.error('根据经纬度查询地址失败')
          }
      })
    },

    getPolygen(merchantId){
      if(!merchantId) return 
      req('mtpsArea',{merchantId}).then(res=>{
        if(res && res.scope){
          let list=JSON.parse(res.scope)
          list.forEach(r=>{
            let x_bak=r.x
            r.x=r.y
            r.y=x_bak
          })
          this.setPolygen(list)
        }
      })
    },

    //设置多边形
    setPolygen(list) {
      if(list.length<=0)return
      
      let path = list.map(res=>{
        return [res.x,res.y]
      })

      let polygon = new AMap.Polygon({
        path: path,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: "#1791fc",
        zIndex: 50,
      });

      setTimeout(() => {
        this.mapDialog.map.add(polygon)
        this.mapDialog.map.setFitView()
      }, 500)
    },

    fetchSuggestions(val,cb){
      if(!val) return cb([])
      if(this.timeout){
        clearTimeout(this.timeout)
        this.timeout=null
      }
      this.timeout=setTimeout(() => {
        this.mapDialog.PlaceSearch.search(val,(status, result) =>{
          // 搜索成功时，result即是对应的匹配数据
          if(result.poiList && result.poiList.pois&& result.poiList.pois.length>0){
            cb(result.poiList.pois.map(re=>{
              return {
                ...re,
                value:re.name
              }
            }))
          }
        })
      }, 300);
    },

    handleSelect(row){
      if(!row) return 
      this.mapDialog.PlaceSearch.setCity(row.adcode);
      this.mapDialog.PlaceSearch.search(row.name);  //关键字查询查询
    }
  }
}
</script>

<style>
#mapSelect{
  height: 400px;
  margin-top: 10px;
}
#mapSelectInput{
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  height: 32px;
  line-height: 32px;
  outline: 0;
  padding: 0 15px;
  width:100%;
}
.amap-sug-result{
  z-index: 9999;
}
</style>