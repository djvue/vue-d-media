<template lang="pug">
NuxtLink.d-media-manager-button(v-if="to" :to="to" :class="{ 'd-media-manager-button_disabled': disabled, [`d-media-manager-button_theme_${theme}`]: theme }")
  .d-media-manager-button__rays(v-if="rayed")
  .d-media-manager-button__inner
    slot
button.d-media-manager-button(v-else @click="$emit('click')" :disabled="disabled" :class="{ 'd-media-manager-button_disabled': disabled, [`d-media-manager-button_theme_${theme}`]: theme }")
  .d-media-manager-button__rays(v-if="rayed")
  .d-media-manager-button__inner
    slot
</template>
<script>
import './index.sass'

export default {
  props: {
    to: { type: [String, Object], default: null },
    rayed: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    theme: { type: String, default: null },
  }
}
</script>
