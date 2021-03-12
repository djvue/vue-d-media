<template lang="pug">
.d-media-manager-sidebar-form
  .d-media-manager-sidebar-form__field(v-for="entity in entities" :key="entity.type")
    .d-media-manager-sidebar-form__field-label {{ entity.name }}
    AppSelect.d-media-manager__filter(:options="entity.options" v-model="filters[entity.type]")
  .d-media-manager-sidebar-form__field
    .d-media-manager-sidebar-form__field-label {{ $t('dMedia.manager.sidebar.altText') }}
    AppInput.d-media-manager-sidebar-form__input(v-model="form.altText")
  .d-media-manager-sidebar-form__field
    .d-media-manager-sidebar-form__field-label {{ $t('dMedia.manager.sidebar.caption') }}
    AppInput.d-media-manager-sidebar-form__input(v-model="form.caption")
  .d-media-manager-sidebar-form__error-message(v-if="errorMessage") {{ errorMessage }}
  button.d-media-manager-sidebar-form__button(
    :class="{ 'd-media-manager-sidebar-form__button_disabled': !hasChanges }"
    @click="handleSave()"
  ) {{ $t('dMedia.manager.sidebar.save') }}
</template>
<script lang="ts">
import {
  Component, Prop, Watch
} from 'vue-property-decorator'
import Base from '@/components/Base'
import { Media } from '@/types/Media'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { FilterEntities } from '@/types/FilterEntities'
import { Entity } from '@/types/Entity'
import { wait } from '@/utils/helpers'

@Component({
  components: { AppInput, AppSelect },
})
export default class ManagerSidebarForm extends Base {
  @Prop({ type: Object, required: true }) private media!: Media

  @Prop({ type: Array, default: null }) private entities!: Entity[]

  private form: { altText: string, caption: string } = { altText: '', caption: '' }

  private errorMessage = ''

  private filters: FilterEntities = {}

  get hasChanges() {
    return this.form.altText !== this.media.altText
      || this.form.caption !== this.media.caption
      || Object.entries(this.filters).reduce((res: boolean, [entityType, value]) => res || JSON.stringify(value) !== JSON.stringify(this.media.entities[entityType]), false)
  }

  created() {
    this.loadForm()
  }

  @Watch('media', { deep: true })
  onMediaChange() {
    this.loadForm()
  }

  loadForm() {
    this.filters = Object.fromEntries(this.entities.map((el) => [el.type, this.media.entities[el.type] || []]))
    this.form = {
      altText: this.media.altText,
      caption: this.media.caption,
    }
  }

  async handleSave() {
    const { success, message, data } = await this.baseConfig.api.repository.save(this.media.id, this.form, this.filters)
    if (!success) {
      this.errorMessage = message
      await wait(5000)
      this.errorMessage = ''
      return
    }
    this.$emit('save', data.media)
  }
}
</script>
<style lang="sass">
@import '~@/assets/styles/variables'
.d-media-manager-sidebar-form
  padding: 32px 0 16px
  &__field
    &:not(:last-child)
      margin-bottom: 16px
  &__field-label
    margin-bottom: 4px
  &__input
    width: 100%
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
