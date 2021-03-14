// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { FilterParams } from './FilterParams'
import { FilterEntities } from './FilterEntities'
import { Media } from './Media'

export type SaveFormInput = { altText: string, caption: string }

export type OnUploadProgressInput = (percentCompleted: number) => void

export type AxiosResponseData = {
  success: boolean
  code: number
  message: string
  data: any
}

export type Response<T> = {
  success: boolean
  code: number
  message: string
  data: T
}

export type Result<T = {}> = Promise<Response<T>>

export type MediaResult = Result<{ media: Media }>

export type FilterResult = Result<{ medias: Media[] }>

export type FilterWithTotalsResult = Result<{
  medias: Media[]
  totals: { [type: string]: number }
}>

export interface RepositoryInterface {
  get(id: number): MediaResult
  filter(params: FilterParams): FilterResult
  filterWithTotals(params: FilterParams): FilterWithTotalsResult
  upload(file: File, entities: FilterEntities, onUploadProgress: OnUploadProgressInput): MediaResult
  save(id: number, form: SaveFormInput, entities: FilterEntities): MediaResult
  remove(id: number): Result
}
