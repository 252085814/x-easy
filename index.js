import xpanel from './x-panel'
import xtable from './x-table'
import xstepwin from './x-step-win'
import xtree from './x-tree'
import xselect from './x-select'
import xremoteselect from './x-remote-select'
import xcheck from './x-check'
import xarea from './x-area'
import xmapmarker from './x-map-marker'
import xpagination from './x-pagination'
import ximgupload from './x-img-upload'
import xempty from './x-empty'

export default (Vue)=>{
  Vue.component("x-panel",xpanel);
  Vue.component("x-table",xtable);
  Vue.component("x-step-win",xstepwin);
  Vue.component("x-tree",xtree);
  Vue.component("x-select",xselect);
  Vue.component("x-remote-select",xremoteselect);
  Vue.component("x-check",xcheck);
  Vue.component("x-area",xarea);
  Vue.component("x-map-marker",xmapmarker);
  Vue.component("x-pagination",xpagination);
  Vue.component("x-img-upload",ximgupload);
  Vue.component("x-empty",xempty);
}