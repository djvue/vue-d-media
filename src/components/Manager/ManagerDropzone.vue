<template lang="pug">
.d-media-manager-dropzone(
  @dragenter="handleDragEnter($event)"
  @dragover.prevent="handleDragOver($event)"
  @dragleave="handleDragLeave($event)"
  @drop.prevent="handleDrop($event)"
  :class="{ 'd-media-manager-dropzone_dropping': dropping }"
)
  button.d-media-manager-dropzone__button(@click="$refs.input.click()") {{ $t('dMedia.manager.dropzone.upload') }}
  span.d-media-manager-dropzone__text {{ $t('dMedia.manager.dropzone.dropText') }}
  input.d-media-manager-dropzone__input(
    ref="input"
    type="file"
    name="file"
    multiple
    :accept="baseConfig.accept[type]"
    @change="handleFileChange($event)"
  )
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Base from '@/components/Base'

@Component({
  components: {},
})
// TODO: add batch upload
export default class DMediaManagerDropzone extends Base {
  @Prop({ type: String, required: true }) private type!: string

  private dropping = false

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDragEnter(event: DragEvent) {
    // console.log('dragenter', event)
    this.dropping = true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDragOver(event: DragEvent) {
    // console.log('dragover', event)
    this.dropping = true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDragLeave(event: DragEvent) {
    // console.log('dragleave', event)
    this.dropping = false
  }

  handleDrop(event: DragEvent) {
    // console.log('drop', (event.dataTransfer as DataTransfer).files)
    this.handleFilesAdded([...(event.dataTransfer as DataTransfer).files])
    this.dropping = false
  }

  handleFileChange() {
    // console.log((this.$refs.input as HTMLInputElement).files)
    const fileList = (this.$refs.input as HTMLInputElement).files as FileList
    this.handleFilesAdded([...fileList])
  }

  handleFilesAdded(files: File[]) {
    this.$emit('uploadFiles', files)
  }
}
</script>
<style lang="sass">
.d-media-manager-dropzone
  cursor: default
  padding: 26px 0
  border: 1px dashed #d9d9d9
  color: #8c8c8c
  text-align: center
  transition: border-color 0.2s
  &_dropping
    border-color: #2D3748
  &__button
    position: relative
    cursor: pointer
    display: inline-block
    padding: 0 20px
    line-height: 33px
    border-radius: 17.5px
    margin-right: 15px
    color: #8c8c8c
    background-color: transparent
    overflow: hidden
    transition: border-color 0.3s, color 0.3s
    &, &:focus, &:active
      border: 1px solid #d9d9d9
      outline: none
    &:hover
      border-color: #262626
      color: #262626
  //&__text
  &__input
    display: none
    cursor: pointer!important
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    opacity: 0
    font-size: 0.1px
    margin: 0

</style>
