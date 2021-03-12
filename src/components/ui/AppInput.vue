<template lang="pug">
input.d-media-manager-input(
  :type="type"
  :placeholder="placeholder"
  :value="value"
  @input="handleInput($event.target.value)"
  @change="handleChange($event.target.value)"
)
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class DMediaManagerInput extends Vue {
  @Prop({ type: [String, Number] }) private value!: string|number

  @Prop({ type: Boolean, default: false }) private lazy!: boolean

  @Prop({ type: String, default: 'text' }) private type!: string

  @Prop({ type: String, default: '' }) private placeholder!: string

  handleInput(value: string) {
    if (!this.lazy) {
      this.$emit('input', value)
    }
  }

  handleChange(value: string) {
    if (this.lazy) {
      this.$emit('input', value)
    }
  }
}
</script>
<style lang="sass">
@import '~@/assets/styles/variables'
.d-media-manager-input
  min-width: 150px
  padding: 12px 16px
  border: 1px solid #e2e8f0
  border-radius: 4px
  font-size: 14px
  line-height: 18px
  $placeholder-color: #A8A8A8
  transition: border-color 0.3s
  &:focus, &:active
    outline: none
  &::-webkit-input-placeholder /* Chrome */
    color: $placeholder-color
  &:-ms-input-placeholder /* IE 10+ */
    color: $placeholder-color
  &::-moz-placeholder /* Firefox 19+ */
    color: $placeholder-color
    opacity: 1

</style>
