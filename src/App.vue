<template lang="pug">
#app.app
  .app__block
    h2.app__label Single Uploader Component with Manager Popup
    SingleUploader(v-model="singleMedias")
  .app__block
    h2.app__label Multi Uploader Component with Manager Popup
    MultiUploader(v-model="multiMedias")
  .app__block
    h2.app__label Manager Popup Button
    button.app__button(@click="$refs.managerPopup.open()") Open Manager Popup
    ManagerPopup(ref="managerPopup")
  .app__block
    h2.app__label Inlined Manager Component
    Manager.app__manager(bordered :entities="entities")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Media } from '~types/structures'
import Manager from './components/Manager/index.vue'
import ManagerPopup from './components/ManagerPopup/index.vue'
import SingleUploader from './components/SingleUploader/index.vue'
import MultiUploader from './components/MultiUploader/index.vue'

@Component({
  components: {
    Manager,
    ManagerPopup,
    SingleUploader,
    MultiUploader,
  },
})
export default class App extends Vue {
  private singleMedias: Media[] = [{
    id: 2,
    url: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
    name: 'Packshot background',
    altText: '',
    caption: '',
    humanSize: '2.92 MB',
    size: 3064170,
    width: 1080,
    height: 1920,
    mimeType: 'image/jpeg',
    entities: {},
    sizes: {
      card: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
      preview: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
    },
  }]

  private multiMedias: Media[] = [{
    id: 2,
    url: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
    name: 'Packshot background',
    altText: '',
    caption: '',
    humanSize: '2.92 MB',
    size: 3064170,
    width: 1080,
    height: 1920,
    mimeType: 'image/jpeg',
    entities: {},
    sizes: {
      card: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
      preview: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
    },
  }, {
    id: 3,
    url: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
    name: 'Packshot background',
    altText: '',
    caption: '',
    humanSize: '2.92 MB',
    size: 3064170,
    width: 1080,
    height: 1920,
    mimeType: 'image/jpeg',
    entities: {},
    sizes: {
      card: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
      preview: 'https://storage.yandexcloud.net/conceptor/uploads/packshot-background-6021c36e02e5f2.37527390.png',
    },
  }]

  get entities() {
    return [
      {
        name: 'Workspace',
        type: 'workspace',
        options: [
          { id: 1, name: 'GGPA' },
          { id: 2, name: 'SOAX' },
          { id: 3, name: 'Volkswagen' }
        ],
        allowMultiple: false
      }
    ]
  }
}
</script>

<style lang="sass">
@import '~@/assets/styles/variables'
body
  margin: 0
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50
  padding: 50px 30px 30px
.app
  &__block
    margin-bottom: 30px
  &__title
    text-align: left
  &__manager
    height: 800px
  &__button
    margin-top: 3px
    cursor: pointer
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
