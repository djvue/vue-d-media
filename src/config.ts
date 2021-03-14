import ApiRepository from '@/api/api'
import { Config, ApiConfig } from '~types/structures'

export const getDefaultConfig = (): Config => {
  const apiConfig: ApiConfig = {
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
