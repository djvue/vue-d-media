import { VueConstructor, PluginObject } from 'vue'

export * from './exports'

declare const plugin: PluginObject<never>
declare const Manager: VueConstructor
declare const ManagerPopup: VueConstructor
declare const SingleUploader: VueConstructor
declare const MultiUploader: VueConstructor

export default plugin

export {
  plugin,
  Manager,
  ManagerPopup,
  SingleUploader,
  MultiUploader,
}
