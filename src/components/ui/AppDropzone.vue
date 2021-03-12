<template lang="pug">
component.app-dropzone(:is="component" v-if="loaded")
</template>
<script>
export default {
  name: 'AppDropzone',
  data() {
    return {
      loaded: false,
      component: 'div',
    }
  },
  computed: {
    options: {
      maxFiles: 1
    }
  },
  async mounted() {
    const VueDropzone = await import('vue2-dropzone')
    this.loaded = true
    this.component = VueDropzone
  }
}
</script>
