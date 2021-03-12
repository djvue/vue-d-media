<template lang="pug">
.d-media-manager-select
  select.d-media-manager-select__input(v-model="currentValue")
    option(:value="null" v-if="placeholder") {{ placeholder }}
    option(v-for="(item, index) in options" :key="index" :value="item.id || item.value || index") {{ item.label || item.name || item }}
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Watch
} from 'vue-property-decorator'

@Component
export default class DMediaManagerSelect extends Vue {
  @Prop({ type: Array, default: () => [] }) private value!: number[]

  @Prop({ type: Array, default: () => [] }) private options!: { id: number, name: string }[]

  @Prop({ type: String, default: '' }) private placeholder!: string|number

  private currentValue: number|null = null

  created() {
    this.currentValue = this.scalarValue
  }

  get arrayCurrentValue(): number[] {
    return this.currentValue ? [this.currentValue] : []
  }

  get scalarValue(): number|null {
    return this.value[0] || null
  }

  @Watch('value')
  onValueChange() {
    if (JSON.stringify(this.value) !== JSON.stringify(this.arrayCurrentValue)) {
      this.currentValue = this.scalarValue
    }
  }

  @Watch('currentValue')
  onCurrentValueChange() {
    if (JSON.stringify(this.value) !== JSON.stringify(this.arrayCurrentValue)) {
      this.$emit('input', [...this.arrayCurrentValue])
    }
  }
}
</script>
<style lang="sass">
@import '~@/assets/styles/variables'
.d-media-manager-select
  position: relative
  &__input
    cursor: pointer
    width: 100%
    padding: 12px 16px
    border: 1px solid $color-borders
    border-radius: 4px
    font-size: 14px
    line-height: 18px
    $placeholder-color: $color-text-main
    &::-webkit-input-placeholder /* Chrome */
      color: $placeholder-color
    &:-ms-input-placeholder /* IE 10+ */
      color: $placeholder-color
    &::-moz-placeholder /* Firefox 19+ */
      color: $placeholder-color
      opacity: 1
    &, &:focus, &:active
      outline: none
  &__error-list
    position: absolute
    left: 0
    bottom: 0
    transform: translateY(100%)
    line-height: 12px
  &__error
    display: inline
    color: red
    font-size: 11px
    line-height: 12px

</style>
