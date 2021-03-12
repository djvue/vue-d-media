<template lang="pug">
.d-media-manager-ui-popup(@click="close()" :class="{ 'd-media-manager-ui-popup_show': show, 'd-media-manager-ui-popup_visible': opened }" v-if="isMounted")
  .d-media-manager-ui-popup__wrapper(@click.stop :class="{ [wrapperClass]: wrapperClass }")
    .d-media-manager-ui-popup__close(@click="close()")
    .d-media-manager-ui-popup__head(v-if="$slots.title" :class="{ [headClass]: headClass }")
      .d-media-manager-ui-popup__title.title
        slot(name="title")
    .d-media-manager-ui-popup__inner(v-if="!$slots.body && !$slots.footer" :class="{ [innerClass]: innerClass }")
      slot
    .d-media-manager-ui-popup__body(v-if="$slots.body")
      slot(name="body")
    .d-media-manager-ui-popup__footer(v-if="$slots.footer")
      slot(name="footer")
</template>
<script>
import './index.sass'
import { getScrollBarWidth } from './get-scroll-bar-width'

const openedPopups = []
let initialBorderPadding = 0

export default {
  props: {
    to: { type: String, default: null },
    rayed: { type: Boolean, default: false },
    defaultShow: { type: Boolean, default: false },
    wrapperClass: { type: String, default: null },
    headClass: { type: String, default: null },
    innerClass: { type: String, default: null }
  },
  data() {
    return {
      opened: false,
      show: false,
      isMounted: false,
    }
  },
  mounted() {
    this.isMounted = true
    if (this.defaultShow) {
      this.open()
    }
  },
  methods: {
    handleDocumentClick() {
      this.close()
    },
    open() {
      if (openedPopups.length === 0) {
        this.addScrollFix()
      }
      openedPopups.push(this)
      this.$emit('opened')
      this.opened = true
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.show = true, 0)
    },
    close() {
      const openedPopupsIndex = openedPopups.indexOf(this)
      if (openedPopupsIndex !== -1) {
        openedPopups.splice(openedPopupsIndex, 1)
      }
      if (openedPopups.length === 0) {
        this.removeScrollFix()
      }
      this.show = false
      // eslint-disable-next-line no-return-assign
      setTimeout(() => {
        this.opened = false
        this.$emit('closed')
      }, 300)
    },
    addScrollFix() {
      initialBorderPadding = window.getComputedStyle(document.body, null).getPropertyValue('padding-left')
      initialBorderPadding = parseInt(initialBorderPadding, 10)
      document.body.classList.add('d-media-manager-ui-popup-scroll-fix')
      document.body.style.paddingRight = `${getScrollBarWidth()}px`
    },
    removeScrollFix() {
      document.body.classList.remove('d-media-manager-ui-popup-scroll-fix')
      document.body.style.paddingRight = `${initialBorderPadding}px`
    }
  }
}
</script>
