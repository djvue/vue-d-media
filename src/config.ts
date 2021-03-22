import ApiRepository from '@/api/api'
import { Config, FullConfig, FullApiConfig } from '~types/structures'

export const getDefaultConfig = (): FullConfig => {
  const apiConfig: FullApiConfig = {
    prefix: '/api/media',
    headers: {}
  }

  return {
    types: ['images', 'files'],
    // @see https://www.dropzonejs.com/#config-acceptedFiles
    accept: {
      images: '.svg, .jpg, .jpeg, .gif, .png, .webp',
      files: '.pdf, .xls, .xlsx, .doc, .docx, .txt, .xml'
    },
    entities: [],
    hiddenEntities: {},
    filterLimit: 42,
    maxFiles: 20,
    maxFilesize: 100,
    api: {
      repository: new ApiRepository(apiConfig),
      config: apiConfig,
    },
  }
}

export const mergeConfig = (a: FullConfig, b: Config): FullConfig => {
  const getCommaProp = (object: never, path: string) => {
    const keys = path.split('.')
    return keys.reduce(
      (el: never, key: string) => (typeof el !== 'object' || el === null ? null : (el[key] || null)) as never,
      object
    )
  }
  const prop = (path: string) => {
    const bProp = getCommaProp(b as never, path)
    return bProp === null ? getCommaProp(a as never, path) : bProp
  }
  return {
    types: prop('types'),
    accept: {
      images: prop('accept.images'),
      files: prop('accept.files'),
    },
    entities: prop('entities'),
    hiddenEntities: prop('hiddenEntities'),
    filterLimit: prop('filterLimit'),
    maxFiles: prop('maxFiles'),
    maxFilesize: prop('maxFilesize'),
    api: {
      repository: b.api?.config ? new ApiRepository(prop('api.config')) : prop('api.repository'),
      config: prop('api.config'),
    },
  }
}
