<template lang="pug">
  .d-media-manager(:class="{ 'd-media-manager_bordered': bordered }")
    .d-media-manager__inner(v-show="this.loadingError")
      .d-media-manager__error {{ this.loadingError }}
    .d-media-manager__inner(v-show="!this.loadingError && !isLoaded")
      AppLoading(full-height)
    .d-media-manager__inner(v-show="!this.loadingError && isLoaded")
      .d-media-manager__head
        .d-media-manager__tab-list
          button.d-media-manager__tab(
            v-for="baseType in baseConfig.types"
            :key="baseType"
            :class="{\
              'd-media-manager__tab_active': baseType === type,\
              'd-media-manager__tab_disabled': !finalTypes.includes(baseType),\
            }"
            @click="type = baseType"
          )
            span.d-media-manager__tab-name {{ $t(`dMedia.manager.types.${baseType}`) }}
            span.d-media-manager__tab-count ({{ totals[baseType] }})
        .d-media-manager__filters
          AppSelect.d-media-manager__filter(
            v-for="entity in finalEntities"
            :key="entity.type"
            :placeholder="entity.name"
            :options="entity.options"
            v-model="filters[entity.type]"
          )
          AppInput.d-media-manager__filter(:placeholder="$t(`dMedia.manager.searchPlaceholder`)" v-model="search")
      .d-media-manager__body
        .d-media-manager__main(ref="main")
          ManagerDropzone.d-media-manager__dropzone(
            :config="baseConfig"
            v-if="uploadEnabled"
            :type="type"
            @uploadFiles="handleUpload($event)"
          )
          ManagerGrid.d-media-manager__grid(
            :config="baseConfig"
            v-model="picked"
            :uploadingMedias="uploadingMedias"
            :medias="medias"
            :type="visualType"
          )
        ManagerSidebar.d-media-manager__sidebar(
          :config="baseConfig"
          v-model="pickedMedias"
          @clearPicked="handleClearPicked()"
          @removePicked="handleRemovePicked()"
          @save="handleSave($event)"
          @submit="handleSubmit()"
          :entities="finalEntities"
          :type="visualType"
          :canSubmit="canSubmit"
        )
</template>
<script lang="ts">
import './index.sass'
import { Component, Prop, Watch } from 'vue-property-decorator'
import AppLoading from '@/components/ui/AppLoading/index.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { Media } from '@/types/Media'
import Base from '@/components/Base'
import { UploadingMedia, UploadingMediaStatus } from '@/types/UploadingMedia'
import { getDataUrl, wait } from '@/utils/helpers'
// import testMedias from '@/utils/test-medias'
import { Entity } from '@/types/Entity'
import { FilterEntities } from '@/types/FilterEntities'
import ManagerDropzone from './ManagerDropzone.vue'
import ManagerGrid from './ManagerGrid.vue'
import ManagerSidebar from './ManagerSidebar.vue'

@Component({
  components: {
    AppLoading, AppInput, AppSelect, ManagerDropzone, ManagerGrid, ManagerSidebar
  }
})
export default class DMediaManager extends Base {
  @Prop({ type: Array, default: () => [] }) private value!: Media[]

  @Prop({ type: Boolean, default: false }) private bordered!: boolean

  @Prop({ type: Boolean, default: true }) private canUpload!: boolean

  @Prop({ type: Boolean, default: false }) private canSubmit!: boolean

  @Prop({ type: Number, default: null }) private maxFiles!: number

  @Prop({ type: Array, default: null }) private types!: string[]

  @Prop({ type: Object, default: null }) private hiddenEntities!: FilterEntities

  @Prop({ type: Array, default: null }) private entities!: Entity[]

  private loadingError = ''

  private isLoaded = false

  private isLoading = false

  private uploadEnabled = true

  private type = ''

  private visualType = ''

  private noMore = false

  private page = 1

  private totals: { [key: string]: number } = {}

  private medias: Media[] = []

  private uploadingMedias: UploadingMedia[] = []

  private uploadedFileLastIndex = -1

  private search = ''

  private filters: FilterEntities = {}

  private picked: number[] = []

  private handleScrollChangeCallback: (() => void)|null = null

  get finalTypes(): string[] {
    return this.types || this.baseConfig.types
  }

  get finalEntities(): Entity[] {
    return this.entities || this.baseConfig.entities
  }

  get finalHiddenEntities(): FilterEntities {
    return this.hiddenEntities || this.baseConfig.hiddenEntities
  }

  get pickedMedias(): Media[] {
    const pickedNotSorted = this.medias.filter((el) => this.picked.includes(el.id))
    return pickedNotSorted.sort((a, b) => this.picked.indexOf(a.id) - this.picked.indexOf(b.id))
  }

  created() {
    this.type = this.finalTypes[0]
    this.picked = this.value.map((el) => el.id)
    this.visualType = this.type
    this.uploadEnabled = this.canUpload
    this.filters = Object.fromEntries(this.finalEntities.map((el) => [el.type, []]))

    if (typeof window === 'object') {
      this.$nextTick(() => {
        this.load()
      })
    }
  }

  mounted() {
    const el = this.$refs.main as HTMLElement
    this.handleScrollChangeCallback = () => this.handleScrollChange()
    el.addEventListener('scroll', this.handleScrollChangeCallback)
  }

  beforeDestroy() {
    const el = this.$refs.main as HTMLElement
    el.removeEventListener('scroll', this.handleScrollChangeCallback as () => void)
  }

  @Watch('search')
  onSearchChange() {
    if (this.isLoaded) {
      this.load()
    }
  }

  @Watch('type')
  onTypeChange() {
    if (this.isLoaded) {
      this.load()
    }
  }

  @Watch('filters', { deep: true })
  onFiltersChange() {
    if (this.isLoaded) {
      this.load()
    }
  }

  handleScrollChange() {
    const el = this.$refs.main as HTMLElement
    const bottomSpace = el.scrollHeight - el.clientHeight - el.scrollTop
    if (bottomSpace < 300 && this.noMore) {
      this.loadMore()
    }
  }

  async load() {
    this.isLoading = true
    this.medias = []
    this.page = 1
    const { success, message, data } = await this.baseConfig.api.repository.filterWithTotals({
      type: this.type,
      page: this.page,
      limit: this.baseConfig.filterLimit,
      search: this.search,
      entities: { ...this.finalHiddenEntities, ...this.filters }
    })
    this.isLoading = false
    if (!success) {
      this.loadingError = message
      await wait(3000)
      this.loadingError = ''
      return
    }
    this.totals = data.totals
    this.medias = data.medias
    if (this.totals[this.type] <= this.medias.length) {
      this.noMore = true
    }
    this.picked = this.picked.filter((id) => this.medias.map((el) => el.id).includes(id))
    this.visualType = this.type
    // for testing
    // this.totals = {
    //   images: 10,
    //   files: 3,
    // }
    // this.medias = testMedias
    this.isLoaded = true
  }

  async loadMore() {
    if (this.isLoading || this.noMore) {
      return
    }
    this.isLoading = true
    this.page += 1
    const { success, message, data } = await this.baseConfig.api.repository.filter({
      type: this.type,
      page: this.page,
      limit: this.baseConfig.filterLimit,
      search: this.search,
      entities: { ...this.finalHiddenEntities, ...this.filters }
    })
    this.isLoading = false
    if (!success) {
      console.error(`Loading more error: ${message}`)
      return
    }
    this.medias = [...this.medias, ...data.medias]
    if (this.totals[this.type] <= this.medias.length) {
      this.noMore = true
    }
  }

  handleUpload(files: File[]) {
    files.forEach(async (file: File) => {
      this.uploadedFileLastIndex += 1
      const id = this.uploadedFileLastIndex
      const media: UploadingMedia = {
        id,
        url: await getDataUrl(file),
        name: file.name,
        type: file.type,
        size: file.size,
        status: UploadingMediaStatus.uploading,
        progress: 0,
        error: '',
      }
      this.uploadingMedias.unshift(media)
      const {
        success, message, /* code, */ data
      } = await this.baseConfig.api.repository.upload(
        file,
        {},
        (percent) => {
          media.progress = percent
        }
      )
      if (!success) {
        media.status = UploadingMediaStatus.error
        media.progress = 100
        media.error = message
        await wait(10000)
        const index = this.getUploadingMediaIndex(id)
        this.uploadingMedias.splice(index, 1)
        return
      }
      const index = this.getUploadingMediaIndex(id)
      this.uploadingMedias.splice(index, 1)
      this.medias.unshift(data.media)
    })
  }

  getUploadingMediaIndex(id: number): number {
    return this.uploadingMedias.map((el) => el.id).indexOf(id)
  }

  handleClearPicked() {
    this.picked.splice(0)
  }

  handleRemovePicked() {
    this.medias = this.medias.filter(({ id }) => !this.picked.includes(id))
    this.handleClearPicked()
  }

  handleSave(media: Media) {
    const index = this.medias.map((el) => el.id).indexOf(media.id)
    this.medias.splice(index, 1, media)
  }

  handleSubmit() {
    this.$emit('input', this.pickedMedias)
  }
}
</script>
