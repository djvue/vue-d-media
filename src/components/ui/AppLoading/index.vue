<template lang="pug">
.d-media-loading(:style="{ minHeight: `${savedHeight}px` }" :class="{ 'd-media-loading_full-height': fullHeight }")
  .d-media-loading__placeholder(v-if="loading" :style="{ backgroundColor }" :class="{\
    'd-media-loading__placeholder_boarded': boarded,\
    [`d-media-loading__placeholder_${size}`]: true,\
  }")
  .d-media-loading__inner(:class="{ 'd-media-loading__inner_hidden': loading }")
    slot
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Base from '@/components/Base'

@Component
export default class DMediaManagerLoading extends Base {
  @Prop({ type: Boolean, default: true }) private loading!: boolean

  @Prop({ type: Boolean, default: false }) private boarded!: boolean

  @Prop({ type: Boolean, default: false }) private fullHeight!: boolean

  @Prop({ type: String, default: 'medium' }) private size!: string

  @Prop({ type: String, default: null }) private backgroundColor!: string

  private savedHeight: number|null = null

  private isMounted = false

  @Watch('loading')
  onLoadingChange() {
    if (!this.isMounted) {
      return
    }
    if (this.loading) {
      this.savedHeight = this.$el.clientHeight
    } else {
      this.savedHeight = null
    }
  }

  mounted() {
    this.isMounted = true
  }
}
</script>
<style lang="sass">
.d-media-loading
  position: relative
  width: 100%
  flex-grow: 1
  &_full-height
    height: 100%
  &__inner
    width: 100%
    height: 100%
    &_hidden
      visibility: hidden
  &__placeholder
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: white
    &_boarded
      border: 1px solid #E5E5E5
    &:before
      content: ''
      position: absolute
      background-image: url(loading.svg)
      background-size: 100%
    &_giant:before
      width: 210px
      height: 210px
      top: calc(50% - 105px)
      left: calc(50% - 105px)
    &_large:before
      width: 150px
      height: 150px
      top: calc(50% - 75px)
      left: calc(50% - 75px)
    &_big:before
      width: 105px
      height: 105px
      top: calc(50% - 52.5px)
      left: calc(50% - 52.5px)
    &_small:before
      width: 30px
      height: 30px
      top: calc(50% - 15px)
      left: calc(50% - 15px)
    &_medium:before
      width: 50px
      height: 50px
      top: calc(50% - 25px)
      left: calc(50% - 25px)
</style>
