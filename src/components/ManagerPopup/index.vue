<template lang="pug">
AppPopup.d-media-manager-popup(ref="popup" wrapper-class="d-media-manager-popup__wrapper" @closed="handleClose()")
  template(v-slot:title) Media Manager
  Manager.d-media-manager-popup__manager(
    v-if="opened"
    :types="types"
    :maxFiles="maxFiles"
    canSubmit
    :value="value"
    @input="handleSubmit($event)"
  )
</template>
<script lang="ts">
import Base from '@/components/Base'
import { Component, Prop } from 'vue-property-decorator'
import AppPopup from '@/components/ui/AppPopup/index.vue'
import { Media } from '~types/structures'

@Component({
  components: {
    Manager: () => import('@/components/Manager/index.vue'),
    AppPopup,
  },
})
export default class DMediaManagerPopup extends Base {
  @Prop({ type: Array, default: () => [] }) private value!: Media[]

  @Prop({ type: Number, default: null }) private maxFiles!: number

  @Prop({ type: Array, default: () => ['images'] }) private types!: string[]

  private opened = false

  get popup() {
    return this.$refs.popup as unknown as { open: () => void, close: () => void }
  }

  open() {
    this.opened = true
    this.popup.open()
  }

  close() {
    this.opened = false
    this.popup.close()
  }

  handleClose() {
    this.opened = false
  }

  handleSubmit(items: Media[]) {
    this.$emit('submit', items)
    this.close()
  }
}
</script>
<style lang="sass">
.d-media-manager-popup
  & &__wrapper
    max-height: 100%
    max-width: 100%
    width: calc(100% - 60px)
    height: calc(100% - 60px)
    @media screen and (min-width: 600px) and (max-width: 849px)
      width: calc(100% - 20px)
      height: calc(100% - 20px)
    @media screen and (max-width: 599px)
      width: 100%
      height: 100%
  &__manager
    height: 100%
</style>
