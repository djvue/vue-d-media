import {
  Component, Prop, Vue
} from 'vue-property-decorator'
import { Config } from '@/types/Config'
import { getDefaultConfig } from '@/config'

@Component
export default class DMediaManagerBase extends Vue {
  @Prop({ type: Object, default: null }) private config!: Config|null

  get baseConfig() {
    // TODO: merge configs!
    return this.config || getDefaultConfig()
  }
}
