import './lib'

import { PluginObject } from 'vue'
import {
  RepositoryInterface,
  AxiosResponseData,
  Result,
  OnUploadProgressInput,
  SaveFormInput,
  FilterResult,
  FilterWithTotalsResult,
  MediaResult,
  Response,
} from './structures/Api'

import {
  // Config
  Config,
  ApiConfig,

  // Types
  Entity,
  FilterEntities,
  FilterParams,
  Media,
  UploadingMedia,
  UploadingMediaStatus,
} from './structures'

export {
  // Api
  RepositoryInterface as ApiRepositoryInterface,
  AxiosResponseData,
  Result as ApiResult,
  OnUploadProgressInput as ApiOnUploadProgressInput,
  SaveFormInput as ApiSaveFormInput,
  FilterResult as ApiFilterResult,
  FilterWithTotalsResult as ApiFilterWithTotalsResult,
  MediaResult as ApiMediaResult,
  Response as ApiResponse,

  // Config
  Config,
  ApiConfig,

  // Types
  Entity,
  FilterEntities,
  FilterParams,
  Media,
  UploadingMedia,
  UploadingMediaStatus,

}
