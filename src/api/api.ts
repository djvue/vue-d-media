import axios, { AxiosInstance } from 'axios'
import { normalize } from '@/api/api-helpers'

import {
  FilterResult,
  MediaResult,
  RepositoryInterface,
  FilterWithTotalsResult,
  SaveFormInput,
  OnUploadProgressInput,
  Result
} from '~types/structures'

import { FilterParams } from '~types/structures/FilterParams'
import { FullApiConfig } from '~types/structures/Config'
import { FilterEntities } from '~types/structures/FilterEntities'

class ApiRepository implements RepositoryInterface {
  protected axios!: AxiosInstance

  constructor(
    protected config: FullApiConfig
  ) {
    this.axios = this.getAxios()
  }

  // eslint-disable-next-line class-methods-use-this
  public getAxios(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseUrl,
      validateStatus: () => true,
      headers: this.config.headers
    })
  }

  protected getEndpoint() {
    return this.config.prefix
  }

  public async get(id: number): MediaResult {
    return normalize(await this.axios.get(`${this.getEndpoint()}/${id}`))
  }

  public async filter(params: FilterParams): FilterResult {
    return normalize(await this.axios.get(this.getEndpoint(), { params: { ...params } }))
  }

  public async filterWithTotals(params: FilterParams): FilterWithTotalsResult {
    return normalize(await this.axios.get(this.getEndpoint(), { params: { withTotals: true, ...params } }))
  }

  public async upload(file: File, entities: FilterEntities, onUploadProgress: OnUploadProgressInput): MediaResult {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('entities', JSON.stringify(entities))
    // formData.append('workspaceId', getWorkspaceId())
    return normalize(await this.axios.post(this.getEndpoint(), formData, {
      onUploadProgress(progressEvent: ProgressEvent) {
        onUploadProgress(Math.floor((progressEvent.loaded * 100) / progressEvent.total))
      }
    }))
  }

  public async save(id: number, form: SaveFormInput, entities: FilterEntities): MediaResult {
    return normalize(await this.axios.put(`${this.getEndpoint()}/${id}`, {
      ...form,
      entities,
    }))
  }

  public async remove(id: number): Result {
    return normalize(await this.axios.delete(`${this.getEndpoint()}/${id}`))
  }
}

export default ApiRepository
