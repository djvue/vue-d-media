<template lang="pug">
.app-upload(v-if="isMounted")
  //VueDropzone(ref="myVueDropzone" id="dropzone" :options="dropzoneOptions")
  VueDropzone.app-upload__dropzone(
    ref="dropzone"
    :id="id"
    :useCustomSlot="true"
    :options="options"
    @vdropzone-mounted="handleDropzoneMounted()"
    @vdropzone-sending="transformRequest"
    @vdropzone-drop="handleDrop"
    @vdropzone-success="handleSuccessUpload"
  )
    //
      @vdropzone-file-added="handleFileAdded()"

    .app-upload__placeholder
      .app-upload__placeholder-text upload image
    .app-upload__constraint-list
      .app-upload__constraint(v-for="(constraint, index) in constraints" :key="constraint") {{ constraint }}
    .app-upload__action(v-if="enableManager" @click.stop="openManagerPopup()") {{ $t('dMedia.singleUploader.manager') }}
  ManagerPopup(v-if="enableManager" ref="managerPopup" :value="value" @submit="handlePopupSubmit($event)" :maxFiles="1")
</template>
<script lang="ts">
import './index.sass'
import Base from '@/components/Base'
import ManagerPopup from '@/components/ManagerPopup/index.vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import hasObjectValue from '@/utils/mixins/has-object-value'
import { AxiosResponse } from 'axios'
// import AppDropzone from './AppDropzone'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import VueDropzone from 'vue2-dropzone'
import { Media, FilterEntities } from '~types/structures'

const THUMBNAIL_WIDTH = 136
const THUMBNAIL_HEIGHT = 136

// TODO: Remove vue2-dropzone dependency
@Component({
  components: {
    // VueDropzone: () => import('vue2-dropzone'),
    VueDropzone,
    ManagerPopup,
  },
  mixins: [hasObjectValue],
})
export default class DMediaManagerSingleUploader extends Base {
  @Prop({ type: Array }) private value!: Media[]

  @Prop({ type: Boolean, default: true }) private enableManager!: boolean

  @Prop({ type: String, default: 'images' }) private type!: string

  @Prop({ type: String, default: null }) private accept!: string

  @Prop({ type: Object, default: null }) private hiddenEntities!: FilterEntities

  @Prop({ type: Array, default: null }) private constraints!: string[]

  // in mb
  @Prop({ type: Number, default: null }) private maxFilesize!: number

  @Prop({ type: Number, default: null }) private minWidth!: number

  @Prop({ type: Number, default: null }) private minHeight!: number

  private id: string|null = null

  private isMounted = false

  private dropzoneMounted = false

  private currentValue: Media[]|null = null

  private cachedValue = ''

  get finalAccept(): string {
    return this.accept || this.baseConfig.accept[this.type]
  }

  get finalMaxFilesize(): number {
    return this.maxFilesize || this.baseConfig.maxFilesize
  }

  get finalHiddenEntities(): FilterEntities {
    return this.hiddenEntities || this.baseConfig.hiddenEntities
  }

  get finalConstraints(): string[] {
    return this.constraints || this.defaultConstraints
  }

  get options(): { [key: string]: any } { // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      // eslint-disable-next-line no-restricted-globals
      url: `${location.origin}${this.baseConfig.api.config.prefix}`,
      /* url: (files) => {
        console.log(files)
        return '/api/board/media'
      }, */
      maxFiles: 1,
      maxFilesize: this.finalMaxFilesize,
      thumbnailWidth: THUMBNAIL_WIDTH,
      thumbnailHeight: THUMBNAIL_HEIGHT,
      thumbnailMethod: 'crop',
      addRemoveLinks: true,
      acceptedFiles: this.finalAccept,
      headers: this.baseConfig.api.config.headers,
      /* accept: (file, done) => {
        console.log('accept', file, this.$refs.dropzone, this.$refs.dropzone.dropzone.files)
        this.$refs.dropzone.removeAllFiles()
        done()
      }, */
    }
  }

  get defaultConstraints() {
    const constraints = []
    if (this.minWidth || this.minHeight) {
      if (!this.minWidth) {
        constraints.push(`Min. height ${this.minHeight} px`)
      } else if (!this.minHeight) {
        constraints.push(`Min. width ${this.minWidth} px`)
      } else {
        constraints.push(`Min. ${this.minWidth}x${this.minHeight}`)
      }
    }
    if (this.finalMaxFilesize) {
      constraints.push(`Max. ${this.finalMaxFilesize}MB`)
    }
    return constraints
  }

  get dropzone() {
    return this.$refs.dropzone as unknown as {
      removeAllFiles: () => void,
      manuallyAddFile: (file: object, url: string) => void,
    }
  }

  get managerPopup() {
    return this.$refs.managerPopup as ManagerPopup
  }

  @Watch('value', { deep: true })
  handleValueChange() {
    this.loadValue()
  }

  @Watch('currentValue', { deep: true })
  handleCurrentValueChange() {
    this.updateValue()
  }

  mounted() {
    // eslint-disable-next-line no-underscore-dangle
    this.id = `app_upload_dropzone_${(this as unknown as { _uid: string })._uid}`
    this.isMounted = true
  }

  handleDropzoneMounted() {
    this.dropzoneMounted = true
    this.loadValue()
    /*
    // for test
    const file = {
      id: 2,
      url: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
      name: 'Packshot background',
      altText: '',
      caption: '',
      humanSize: '2.92 MB',
      size: 3064170,
      width: 1080,
      height: 1920,
      mimeType: null,
    }
    const dropzoneFile = this.makeDropzoneFile(file)
    this.$refs.dropzone.manuallyAddFile(dropzoneFile, file.url)
     */
  }

  loadValue() {
    if (!this.canLoadValue()) {
      return
    }
    const value = this.transformValue(this.value as never)
    if (value === null) {
      this.currentValue = null
      this.cachedValue = ''
      return
    }
    const jsonValue = JSON.stringify(value)
    if (jsonValue !== this.cachedValue) {
      this.currentValue = JSON.parse(jsonValue)
      this.afterLoadCurrentValue()
    }
  }

  afterLoadCurrentValue() {
    if (this.currentValue && this.currentValue[0]) {
      const file = this.currentValue[0]
      const dropzoneFile = this.makeDropzoneFile(file)
      this.dropzone.manuallyAddFile(dropzoneFile, this.makeImgUrl(file.url))
    }
  }

  canLoadValue() {
    return this.dropzoneMounted
  }

  openManagerPopup() {
    this.managerPopup.open()
  }

  handlePopupSubmit(files: Media[]) {
    // console.log(files)
    files.forEach((file) => {
      const dropzoneFile = { size: 123, name: file.name, type: file.mimeType || 'image/jpg' }
      this.dropzone.manuallyAddFile(dropzoneFile, this.makeImgUrl(file.url))
      this.$emit('input', [file])
    })
  }

  makeDropzoneFile(file: Media) {
    return { size: 123, name: file.name, type: file.mimeType || 'image/jpg' }
  }

  makeImgUrl(url: string): string {
    if (typeof (this as unknown as { $jpeg: never }).$jpeg === 'function') {
      return ((this as unknown as { $jpeg: never }).$jpeg as (url: string, size: string, type: string) => string)(url, `${THUMBNAIL_WIDTH}x${THUMBNAIL_HEIGHT}`, 'crop')
    }
    return url
  }

  transformRequest(file: never, xhr: never, formData: FormData) {
    formData.append('entities', JSON.stringify(this.finalHiddenEntities))
  }

  handleDrop() {
    this.dropzone.removeAllFiles()
  }

  handleSuccessUpload(file: never, response: AxiosResponse) {
    this.$emit('input', [response.data.media])
  }

  updateValue() {
    const jsonCurrentValue = this.currentValue === null ? '' : JSON.stringify(this.currentValue)
    if (this.cachedValue !== jsonCurrentValue) {
      this.$emit('input', jsonCurrentValue === '' ? null : JSON.parse(jsonCurrentValue))
    }
    this.cachedValue = jsonCurrentValue
  }

  transformValue(value: never) {
    if (!value || typeof value !== 'object') {
      return []
    }
    if (!Array.isArray(value)) {
      return [value]
    }
    return value
  }
}
</script>
