import { FilterParams } from '@/types/FilterParams'
import { FilterEntities } from '@/types/FilterEntities'
import { Media } from './Media'
import { PromiseApiResult } from './PromiseApiResult'

export type SaveForm = { altText: string, caption: string }
export type MediaPromiseApiResult = PromiseApiResult<{ media: Media }>
export type FilterPromiseApiResult = PromiseApiResult<{ medias: Media[] }>
export type FilterWithTotalsPromiseApiResult = PromiseApiResult<{
  medias: Media[]
  totals: { [type: string]: number }
}>
export type OnUploadProgress = (percentCompleted: number) => void

export interface ApiRepositoryInterface {
  get(id: number): MediaPromiseApiResult
  filter(params: FilterParams): FilterPromiseApiResult
  filterWithTotals(params: FilterParams): FilterWithTotalsPromiseApiResult
  upload(file: File, entities: FilterEntities, onUploadProgress: OnUploadProgress): MediaPromiseApiResult
  save(id: number, form: SaveForm, entities: FilterEntities): MediaPromiseApiResult
  remove(id: number): PromiseApiResult
}
