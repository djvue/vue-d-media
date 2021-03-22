import Manager from './components/Manager/index.vue'
import ManagerPopup from './components/ManagerPopup/index.vue'
import SingleUploader from './components/SingleUploader/index.vue'
import MultiUploader from './components/MultiUploader/index.vue'

import { plugin } from './plugin'
import './assets/styles/main.sass'

export const install = plugin.install

export {
  plugin,
  Manager,
  ManagerPopup,
  SingleUploader,
  MultiUploader,
}

export default plugin
