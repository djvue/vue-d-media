import {
  Component, Prop, Vue
} from 'vue-property-decorator'
import { getDefaultConfig } from '@/config'
import { Config } from '~types/structures'

@Component
export default class DMediaManagerBase extends Vue {
  @Prop({ type: Object, default: null }) private config!: Config|null

  get baseConfig() {
    // TODO: merge configs!
    return this.config || getDefaultConfig()
  }
}
