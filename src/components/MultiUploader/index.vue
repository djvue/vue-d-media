<template lang="pug">
.d-media-manager-multi-uploader.vue-d-media-common(v-if="isMounted")
  //VueDropzone(ref="myVueDropzone" id="dropzone" :options="dropzoneOptions")
  .d-media-manager-multi-uploader__box
    VueDropzone.d-media-manager-multi-uploader__dropzone(
      ref="dropzone"
      :id="id"
      :useCustomSlot="true"
      :options="options"
      @vdropzone-mounted="handleDropzoneMounted()"
      @vdropzone-sending="transformRequest"
      @vdropzone-drop="handleDrop"
      @vdropzone-success="handleSuccessUpload"
      @vdropzone-removed-file="handleRemove"
    )
      .d-media-manager-multi-uploader__placeholder
        AppButton {{ finalAddText }}
      //
        @vdropzone-file-added="handleFileAdded()"

  //.d-media-manager-multi-uploader__placeholder
    .d-media-manager-multi-uploader__placeholder-text upload image
  footer.d-media-manager-multi-uploader__footer
    .d-media-manager-multi-uploader__action(v-if="enableManager" @click.stop="openManagerPopup()") {{ $t('dMedia.multiUploader.manager') }}
    .d-media-manager-multi-uploader__constraint-list
      .d-media-manager-multi-uploader__constraint(v-for="(constraint, index) in (constraints || defaultConstraints)" :key="constraint") {{ constraint }}
  ManagerPopup(v-if="enableManager" ref="managerPopup" @submit="handlePopupSubmit($event)" :maxFiles="maxFiles" :value="value" :config="config")
</template>
<script lang="ts">
import './index.sass'
import { Component, Prop, Watch } from 'vue-property-decorator'
import Base from '@/components/Base'
import hasObjectValue from '@/utils/mixins/has-object-value'
import { AxiosResponse } from 'axios'
import ManagerPopup from '@/components/ManagerPopup/index.vue'
import AppButton from '@/components/ui/AppButton/index.vue'
import VueDropzone from 'vue2-dropzone'
import { FilterEntities, Media } from '~types/structures'
import { resize } from '@/utils/resize'

// import AppDropzone from './AppDropzone'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'

type DropzoneFile = {
  id: number
  size: number
  name: string
  type: string
  url: string
}

const THUMBNAIL_WIDTH = 136
const THUMBNAIL_HEIGHT = 136

// TODO: Remove vue2-dropzone dependency
@Component({
  components: {
    // VueDropzone: () => import('vue2-dropzone'),
    VueDropzone,
    ManagerPopup,
    AppButton,
  },
  mixins: [hasObjectValue],
})
export default class DMediaManagerMultipleUploader extends Base {
  @Prop({ type: Array }) private value!: Media[]

  @Prop({ type: Boolean, default: true }) private enableManager!: boolean

  @Prop({ type: String, default: 'images' }) private type!: string

  @Prop({ type: String, default: null }) private accept!: string

  @Prop({ type: Object, default: null }) private hiddenEntities!: FilterEntities

  @Prop({ type: String, default: null }) private addText!: string

  @Prop({ type: Array, default: null }) private constraints!: string[]

  // in mb
  @Prop({ type: Number, default: null }) private maxFilesize!: number

  @Prop({ type: Number, default: null }) private maxFiles!: number

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

  get finalAddText(): string {
    return this.addText || (this.$t('dMedia.multiUploader.addText') as string)
  }

  get finalMaxFiles(): number {
    return this.maxFiles || this.baseConfig.maxFiles
  }

  get finalMaxFilesize(): number {
    return this.maxFilesize || this.baseConfig.maxFilesize
  }

  get finalHiddenEntities(): FilterEntities {
    return this.hiddenEntities || this.baseConfig.hiddenEntities
  }

  get options(): { [key: string]: object|string|number|boolean } {
    return {
      // eslint-disable-next-line no-restricted-globals
      url: `${this.baseConfig.api.config.baseUrl || location.origin}${this.baseConfig.api.config.prefix}`,
      /* url: (files) => {
        console.log(files)
        return '/api/board/media'
      }, */
      maxFiles: this.finalMaxFiles,
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
    if (this.maxFiles) {
      constraints.push(`Max. files ${this.maxFiles}`)
    }
    if (this.minWidth || this.minHeight) {
      if (!this.minWidth) {
        constraints.push(`Min. height ${this.minHeight} px`)
      } else if (!this.minHeight) {
        constraints.push(`Min. width ${this.minWidth} px`)
      } else {
        constraints.push(`Min. ${this.minWidth}x${this.minHeight}`)
      }
    }
    if (this.maxFilesize) {
      constraints.push(`Max. ${this.maxFilesize}MB`)
    }
    return constraints
  }

  get dropzone() {
    return this.$refs.dropzone as unknown as {
      removeAllFiles: () => void,
      removeFile: (file: Media|DropzoneFile) => void,
      manuallyAddFile: (file: Media|DropzoneFile, url: string) => void,
      getActiveFiles: () => Media[]
    }
  }

  get managerPopup() {
    return this.$refs.managerPopup as ManagerPopup
  }

  created() {
    this.loadValue()
  }

  mounted() {
    // eslint-disable-next-line no-underscore-dangle
    this.id = `app_upload_dropzone_${(this as unknown as { _uid: string})._uid}`
    this.isMounted = true
  }

  @Watch('value', { deep: true })
  handleValueChange() {
    this.loadValue()
  }

  @Watch('currentValue', { deep: true })
  handleCurrentValueChange() {
    this.updateValue()
  }

  handleDropzoneMounted() {
    this.dropzoneMounted = true
    this.loadValue()
    /*
    for test
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

  canLoadValue() {
    return this.dropzoneMounted
  }

  afterLoadCurrentValue() {
    this.syncDropzone()
  }

  syncDropzone() {
    // console.trace('syncDropzone')
    const dropzone = this.dropzone
    let files = dropzone.getActiveFiles();
    (this.currentValue as Media[]).forEach((file, index) => {
      while (files.length > index) {
        if (files[index].id === file.id) {
          return
        }
        dropzone.removeFile(files[index])
        files = files.splice(index, 1)
      }
      const dropzoneFile = this.makeDropzoneFile(file)
      dropzone.manuallyAddFile(dropzoneFile, this.makeImgUrl(file.url))
    })
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

  openManagerPopup() {
    this.managerPopup.open()
  }

  handlePopupSubmit(files: Media[]) {
    this.dropzone.removeAllFiles()
    files.forEach((file) => {
      (this.currentValue as Media[]).push(file)
      const dropzoneFile = this.makeDropzoneFile(file)
      this.dropzone.manuallyAddFile(dropzoneFile, this.makeImgUrl(file.url))
    })
  }

  makeDropzoneFile(file: Media): DropzoneFile {
    return {
      id: file.id, size: file.size, name: file.name, type: file.mimeType || 'image/jpg', url: file.url
    }
  }

  makeImgUrl(url: string): string {
    return resize(this, url, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, 'jpeg', 'crop')
  }

  transformRequest(file: never, xhr: never, formData: FormData) {
    formData.append('entities', JSON.stringify(this.finalHiddenEntities))
  }

  handleDrop() {
    // this.$refs.dropzone.removeAllFiles()
  }

  handleRemove(file: Media) {
    const fileIndex = (this.currentValue as Media[]).map((el) => el.id).indexOf(file.id)
    if (fileIndex !== -1) {
      (this.currentValue as Media[]).splice(fileIndex, 1)
    }
  }

  handleSuccessUpload(file: never, response: AxiosResponse) {
    (this.currentValue as Media[]).push(response.data.media)
    // this.$emit('input', [response.data.media])
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

  updateValue() {
    const jsonCurrentValue = this.currentValue === null ? '' : JSON.stringify(this.currentValue)
    if (this.cachedValue !== jsonCurrentValue) {
      this.$emit('input', jsonCurrentValue === '' ? null : JSON.parse(jsonCurrentValue))
    }
    this.cachedValue = jsonCurrentValue
  }
}
</script>
