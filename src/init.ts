import { VueConstructor } from 'vue'
// like in https://github.com/alexusmai/vue-laravel-file-manager
import MediaManager from './MediaManager.vue';

/**
 * Install
 *
 * @param Vue
 * @param options
 */
export default function install(Vue: VueConstructor, options = {}) {
  Vue.component('DMediaManager', MediaManager);
}
