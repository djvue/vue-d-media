import {
  Component, Prop, Vue
} from 'vue-property-decorator'
import { getDefaultConfig, mergeConfig } from '@/config'
import { Config, FullConfig } from '~types/structures'

@Component
export default class DMediaManagerBase extends Vue {
  @Prop({ type: Object, default: null }) private config!: Config|null

  get baseConfig(): FullConfig {
    return mergeConfig(getDefaultConfig(), this.config || {})
  }
}
