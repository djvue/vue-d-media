import { PluginObject } from 'vue'

import Manager from './components/Manager/index.vue'
import ManagerPopup from './components/ManagerPopup/index.vue'
import SingleUploader from './components/SingleUploader/index.vue'
import MultiUploader from './components/MultiUploader/index.vue'

export const plugin: PluginObject<never> = {
  installed: false,

  install(Vue) {
    if (this.installed) {
      return
    }
    this.installed = true
    Vue.component('VueDMediaManager', Manager)
    Vue.component('VueDMediaManagerPopup', ManagerPopup)
    Vue.component('VueDMediaSingleUploader', SingleUploader)
    Vue.component('VueDMediaMultiUploader', MultiUploader)
  }
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}
