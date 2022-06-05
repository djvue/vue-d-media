<template lang="pug">
.d-media-manager-grid
  .d-media-manager-grid__item-wrapper(v-for="(item, index) in uploadingMedias" :key="`uploading_media_${index}`")
    .d-media-manager-grid__item.d-media-manager__item_uploading
      .d-media-manager-grid__item-progress
        .d-media-manager__item-progress-line(style="{ width: `${item.progress}%` }")
      img.d-media-manager-grid__item-img(:src="item.url" :alt="item.name" v-if="isImages")
      .d-media-manager-grid__item-file-label(v-if="isFiles")
        .d-media-manager-grid__item-file-name {{ item.name }}
        .d-media-manager-grid__item-file-meta-label {{ item.type }}
      .d-media-manager__item-error(v-if="item.error") {{ item.error }}
  .d-media-manager-grid__item-wrapper(v-for="(item, index) in medias" :key="item.id")
    .d-media-manager-grid__item(
      @click="handleClick(item.id)"
      :class="{\
        'd-media-manager-grid__item_picked': isPicked(item.id),\
      }"
    )
      .d-media-manager-grid__item-index(v-if="isPicked(item.id)") {{ getPickedIndex(item.id) + 1 }}
      img.d-media-manager-grid__item-img(:src="item.sizes.card" :alt="item.name" v-if="isImages")
      .d-media-manager-grid__item-file-label(v-if="isFiles")
        .d-media-manager-grid__item-file-name {{ item.name }}
        .d-media-manager-grid__item-file-meta-label {{ item.mimeType }}
        .d-media-manager-grid__item-file-meta-label {{ item.humanSize }}
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Base from '@/components/Base'
import { Media, UploadingMedia } from '~types/structures'

// TODO: add image cover/contain option
// TODO: add canvas uploaded image rendering https://gist.github.com/mfyz/10198229
@Component({
  components: {},
})
export default class DMediaManagerGrid extends Base {
  @Prop({ type: Array, default: () => [] }) private value!: number[]

  @Prop({ type: Array, default: () => [] }) private medias!: Media[]

  @Prop({ type: Array, default: () => [] }) private uploadingMedias!: UploadingMedia[]

  @Prop({ type: String, default: 'images' }) private type!: string

  private picked: number[] = []

  private shiftPressed = false

  private keyDownListener: ((event: KeyboardEvent) => void)|null = null

  private lastClicked: number|null = null

  get isImages() {
    return this.type === 'images'
  }

  get isFiles() {
    return this.type === 'files'
  }

  created() {
    this.picked = [...this.value]
  }

  mounted() {
    this.keyDownListener = this.handleKeyDown.bind(this)
    document.addEventListener('keydown', this.keyDownListener)
    document.addEventListener('keyup', this.keyDownListener)
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownListener as (event: KeyboardEvent) => void)
    document.removeEventListener('keyup', this.keyDownListener as (event: KeyboardEvent) => void)
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Shift') {
      return
    }
    if (event.type === 'keydown') {
      this.shiftPressed = true
    } else {
      this.shiftPressed = false
    }
  }

  @Watch('value', { deep: true })
  onValueChange() {
    if (JSON.stringify(this.value) !== JSON.stringify(this.picked)) {
      this.picked = [...this.value]
    }
  }

  @Watch('picked', { deep: true })
  onPickedChange() {
    if (JSON.stringify(this.value) !== JSON.stringify(this.picked)) {
      this.$emit('input', [...this.picked])
    }
  }

  isPicked(id: number): boolean {
    return this.getPickedIndex(id) !== null
  }

  getPickedIndex(id: number): number|null {
    const index = this.picked.indexOf(id)
    return index === -1 ? null : index
  }

  getMediaIndex(id: number): number {
    return this.medias.map((el) => el.id).indexOf(id)
  }

  handleClick(id: number): void {
    if (!this.shiftPressed || this.lastClicked === null) {
      this.lastClicked = id
      this.togglePick(id)
      return
    }
    const prevIndex = this.getMediaIndex(this.lastClicked)
    const index = this.getMediaIndex(id)
    const isPicked = this.isPicked(id)
    for (let i = Math.min(index, prevIndex); i <= Math.max(index, prevIndex); i += 1) {
      const iterId = this.medias[i].id
      if (isPicked) {
        this.unpick(iterId)
      } else {
        this.pick(iterId)
      }
    }
  }

  togglePick(id: number): void {
    const index = this.getPickedIndex(id)
    if (index !== null) {
      this.picked.splice(index, 1)
    } else {
      this.picked.push(id)
    }
  }

  unpick(id: number): void {
    const index = this.getPickedIndex(id)
    if (index !== null) {
      this.picked.splice(index, 1)
    }
  }

  pick(id: number): void {
    const index = this.getPickedIndex(id)
    if (index !== null) {
      this.unpick(id)
    }
    this.picked.push(id)
  }
}
</script>
<style lang="sass">
@import '~@/assets/styles/variables'
$margin: 16px
$semi-margin: $margin / 2
.d-media-manager-grid
  margin: -$semi-margin
  user-select: none
  *, *:before, *:after
    box-sizing: border-box
  display: flex
  flex-flow: row wrap
  justify-content: flex-start
  &__item-wrapper
    position: relative
    $n: 2
    width: (100% / $n)
    padding-bottom: (100% / $n)
    @media screen and (min-width: 800px)
      $n: 3
      width: (100% / $n)
      padding-bottom: (100% / $n)
    @media screen and (min-width: 1000px)
      $n: 4
      width: (100% / $n)
      padding-bottom: (100% / $n)
    @media screen and (min-width: 1200px)
      $n: 5
      width: (100% / $n)
      padding-bottom: (100% / $n)
    @media screen and (min-width: 1400px)
      $n: 6
      width: (100% / $n)
      padding-bottom: (100% / $n)
    @media screen and (min-width: 1600px)
      $n: 7
      width: (100% / $n)
      padding-bottom: (100% / $n)
  &__item
    cursor: pointer
    position: absolute
    top: $semi-margin
    left: $semi-margin
    bottom: $semi-margin
    right: $semi-margin
    display: flex
    justify-content: center
    align-items: center
    background-color: #f6f6f6
    &:before, &:after
      content: ''
      display: block
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
    &:before
      border: 1px solid rgba(0, 0, 0, .05)
    &:after
      border: 4px solid #4299e1
      transition: opacity 0.3s
      opacity: 0
    &_picked:after
      opacity: 1
  &__item-index
    position: absolute
    top: 4px
    right: 4px
    min-width: 24px
    height: 24px
    background-color: #333333
    line-height: 24px
    font-size: 18px
    padding: 0 5px
  &__item-img
    display: block
    max-width: 100%
    max-height: 100%
    height: auto
  &__item-file-label
    text-align: center
    width: 100%
    height: 100%
    display: flex
    flex-flow: column nowrap
    justify-content: center
    align-items: center
  &__item-file-name
    font-weight: 700
    margin-bottom: 8px
  &__item-file-meta-label
    display: block
    padding: 3px 6px
    border: 1px solid $color-borders
    font-size: 14px
    border-radius: 4px
    &:not(:last-child)
      margin-right: 8px
  &__item-progress
    position: absolute
    left: 0
    right: 0
    bottom: 0
    height: 8px
    border: 1px solid #b5b5b5
    background-color: #e0e0e0
  &__item-progress-line
    height: 100%
    background-color: #4299e1
  &__item-error
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    background-color: rgba(0, 0, 0, 0.7)
    color: white
    display: flex
    align-items: center
    justify-content: center
    text-align: center
    padding: 20px
</style>
