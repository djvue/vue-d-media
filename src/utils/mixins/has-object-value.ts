import Vue from 'vue'

export default Vue.extend({
  props: {
    value: { type: [Object, Array] }
  },
  data() {
    return {
      currentValue: null,
      cachedValue: ''
    }
  },
  created() {
    this.loadValue()
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.loadValue()
      },
    },
    currentValue: {
      deep: true,
      handler() {
        this.updateValue()
      },
    },
  },
  methods: {
    loadValue() {
      if (!this.canLoadValue()) {
        return
      }
      const value = this.transformValue(this.value as never)
      if (value === null) {
        this.currentValue = null
        this.cachedValue = ''
        return
      }
      const jsonValue = JSON.stringify(value)
      if (jsonValue !== this.cachedValue) {
        this.currentValue = JSON.parse(jsonValue)
        this.afterLoadCurrentValue()
      }
    },
    canLoadValue() {
      return true
    },
    afterLoadCurrentValue() {
      // can replace in child
    },
    updateValue() {
      const jsonCurrentValue = this.currentValue === null ? '' : JSON.stringify(this.currentValue)
      if (this.cachedValue !== jsonCurrentValue) {
        this.$emit('input', jsonCurrentValue === '' ? null : JSON.parse(jsonCurrentValue))
      }
      this.cachedValue = jsonCurrentValue
    },
    transformValue(value: never) {
      if (typeof value !== 'object' || typeof value === 'undefined') {
        return null
      }
      return value
    },
  },
})
