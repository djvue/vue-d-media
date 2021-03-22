<template lang="pug">
NuxtLink.app-button(v-if="to" :to="to" :class="{ 'app-button_disabled': disabled, [`app-button_theme_${theme}`]: theme }")
  .app-button__rays(v-if="rayed")
  .app-button__inner
    slot
button.app-button(v-else @click="$emit('click')" :disabled="disabled" :class="{ 'app-button_disabled': disabled, [`app-button_theme_${theme}`]: theme }")
  .app-button__rays(v-if="rayed")
  .app-button__inner
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
