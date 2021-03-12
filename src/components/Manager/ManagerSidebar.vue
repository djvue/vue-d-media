<template lang="pug">
aside.d-media-manager-sidebar(v-if="value.length === 0")
  .d-media-manager-sidebar__inner
    .d-media-manager-sidebar__chosen {{ $t('dMedia.manager.sidebar.noPicked') }}
aside.d-media-manager-sidebar(v-else-if="value.length > 1")
  .d-media-manager-sidebar__inner
    .d-media-manager-sidebar__chosen {{ $tc('dMedia.manager.sidebar.chosen', value.length) }}
    .d-media-manager-sidebar__actions
      button.d-media-manager-sidebar__action(@click="clearPicked()") {{ $t('dMedia.manager.sidebar.clearPicked') }}
      button.d-media-manager-sidebar__action(@click="handleDelete()")
        DeleteIcon
    button.d-media-manager-sidebar__button(
      v-if="canSubmit"
      @click="handleSubmit()"
    ) {{ $t('dMedia.manager.sidebar.submit') }}
aside.d-media-manager-sidebar(v-else)
  .d-media-manager-sidebar__inner
    .d-media-manager-sidebar__card
      .d-media-manager-sidebar__image-box(v-if="isImages")
        img.d-media-manager-sidebar__image(:src="media.url")
      .d-media-manager-sidebar__name {{ media.name }}
      .d-media-manager-sidebar__meta
        span.d-media-manager-sidebar__meta-label {{ media.mimeType }}
        span.d-media-manager-sidebar__meta-label(v-if="isImages") {{ media.width }}x{{ media.height }}
        span.d-media-manager-sidebar__meta-label {{ media.humanSize }}
      .d-media-manager-sidebar__actions
        a.d-media-manager-sidebar__action(:href="media.url" download)
          DownloadIcon
        button.d-media-manager-sidebar__action(@click="handleDelete()")
          DeleteIcon
      .d-media-manager-sidebar__remove-error(v-if="removeError") {{ removeError }}
    ManagerSidebarForm.d-media-manager-sidebar__form(:media="media" :config="baseConfig" :entities="entities" @save="handleSave($event)")
    button.d-media-manager-sidebar__button(
      v-if="canSubmit"
      @click="handleSubmit()"
    ) {{ $t('dMedia.manager.sidebar.submit') }}
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Media } from '@/types/Media'
import Base from '@/components/Base'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
import DownloadIcon from '@/components/Icons/DownloadIcon.vue'
import { wait } from '@/utils/helpers'
import { Entity } from '@/types/Entity'
import ManagerSidebarForm from './ManagerSidebarForm.vue'

@Component({
  components: { DownloadIcon, DeleteIcon, ManagerSidebarForm },
})
export default class DMediaManagerSidebar extends Base {
  @Prop({ type: Array, default: () => [] }) private value!: Media[]

  @Prop({ type: String, default: 'images' }) private type!: string

  @Prop({ type: Array, default: null }) private entities!: Entity[]

  @Prop({ type: Boolean, default: false }) private canSubmit!: boolean

  private removeError = ''

  get isImages() {
    return this.type === 'images'
  }

  get isFiles() {
    return this.type === 'files'
  }

  @Watch('value', { deep: true })
  onValueChange() {
    this.$forceUpdate()
  }

  get media(): Media|null {
    if (this.value.length !== 1) {
      return null
    }
    return this.value[0]
  }

  handleDelete() {
    this.value.forEach(async (media) => {
      const { success, message } = await this.baseConfig.api.repository.remove(media.id)
      if (!success) {
        this.removeError = `Remove error: ${message}`
        await wait(5000)
        this.removeError = ''
      }
      this.$emit('removePicked')
    })
  }

  clearPicked() {
    this.$emit('clearPicked')
  }

  handleSave(media: Media) {
    this.$emit('save', media)
  }

  handleSubmit() {
    this.$emit('submit')
  }
}
</script>
<style lang="sass">
@import '~@/assets/styles/variables'
.d-media-manager-sidebar
  border-left: 1px solid $color-borders
  padding: 16px
  text-align: left
  &__chosen
    margin-bottom: 16px
  &__card
    border-bottom: 1px solid $color-borders
    padding-bottom: 16px
  &__image-box
    height: 150px
    margin-bottom: 16px
  &__image
    display: block
    max-width: 150px
    max-height: 150px
  &__name
    text-align: left
    margin-bottom: 16px
  &__meta
    display: flex
    justify-content: flex-start
    flex-flow: row wrap
    margin-bottom: 16px
  &__meta-label
    display: block
    padding: 3px 6px
    border: 1px solid $color-borders
    font-size: 14px
    border-radius: 4px
    &:not(:last-child)
      margin-right: 8px
  &__actions
    display: inline-flex
    border: 1px solid $color-borders
    margin-bottom: 16px
  &__action
    cursor: pointer
    padding: 6px 16px
    height: 36px
    opacity: 0.5
    transition: background-color 0.3s, opacity 0.3s
    outline: none
    border: none
    background-color: white
    &:hover
      opacity: 1
      background-color: #efefef
    &:not(:last-child)
      border-right: 1px solid $color-borders
  &__remove-error
    color: red
    font-size: 14px
    margin-bottom: 16px
  &__button
    margin-top: 3px
    cursor: pointer
    width: 100%
    padding: 12px 16px
    border: 1px solid $color-borders
    border-radius: 4px
    font-weight: 700
    color: $color-text-main
    background-color: white
    transition: background-color 0.3s
    &_disabled
      opacity: 0.6
    &, &:focus, &:active, &:hover
      outline: none
    &:hover
      background-color: $color-bg
</style>
