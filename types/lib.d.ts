declare module 'vue-d-media/lib' {
  import { VueConstructor, PluginObject } from 'vue'

  const plugin: PluginObject<never>
  const Manager: VueConstructor
  const ManagerPopup: VueConstructor
  const SingleUploader: VueConstructor
  const MultiUploader: VueConstructor

  export default plugin

  export {
    plugin,
    Manager,
    ManagerPopup,
    SingleUploader,
    MultiUploader,
  }
}
