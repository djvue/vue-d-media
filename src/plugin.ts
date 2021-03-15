import _Vue, { PluginObject, PluginFunction } from 'vue'

import Manager from './components/Manager/index.vue'
import ManagerPopup from './components/ManagerPopup/index.vue'
import SingleUploader from './components/SingleUploader/index.vue'
import MultiUploader from './components/MultiUploader/index.vue'

export interface InstallFunction extends PluginFunction<{}> {
  installed?: boolean
}

const install: InstallFunction = (Vue: typeof _Vue) => {
  if (install.installed) {
    return
  }

  Vue.component('vue-d-media-manager', Manager)
  Vue.component('VueDMediaManagerPopup', ManagerPopup)
  Vue.component('VueDMediaSingleUploader', SingleUploader)
  Vue.component('VueDMediaMultiUploader', MultiUploader)
  install.installed = true
}

export const plugin: PluginObject<{}> = {
  install
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
