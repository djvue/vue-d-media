import axios, { AxiosInstance } from 'axios'
import { normalize } from '@/api/api-helpers'
import { PromiseApiResult } from '@/types/PromiseApiResult'

import {
  ApiRepositoryInterface,
  FilterPromiseApiResult,
  FilterWithTotalsPromiseApiResult,
  MediaPromiseApiResult, OnUploadProgress, SaveForm
} from '@/types/Api'
import { FilterParams } from '@/types/FilterParams'
import { ApiConfig } from '@/types/Config'
import { FilterEntities } from '@/types/FilterEntities'

const getWorkspaceId = () => 1

class ApiRepository implements ApiRepositoryInterface {
  protected axios!: AxiosInstance

  constructor(
    protected config: ApiConfig
  ) {
    this.axios = this.getAxios()
  }

  // eslint-disable-next-line class-methods-use-this
  public getAxios(): AxiosInstance {
    return axios.create({
      validateStatus: () => true,
      headers: this.config.headers
    })
  }

  protected getEndpoint() {
    return this.config.prefix
  }

  public async get(id: number): MediaPromiseApiResult {
    return normalize(await this.axios.get(`${this.getEndpoint()}/${id}`))
  }

  public async filter(params: FilterParams): FilterPromiseApiResult {
    return normalize(await this.axios.get(this.getEndpoint(), { params: { ...params } }))
  }

  public async filterWithTotals(params: FilterParams): FilterWithTotalsPromiseApiResult {
    return normalize(await this.axios.get(this.getEndpoint(), { params: { withTotals: true, ...params } }))
  }

  public async upload(file: File, entities: FilterEntities, onUploadProgress: OnUploadProgress): MediaPromiseApiResult {
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

  public async save(id: number, form: SaveForm, entities: FilterEntities): MediaPromiseApiResult {
    return normalize(await this.axios.put(`${this.getEndpoint()}/${id}`, {
      ...form,
      entities,
    }))
  }

  public async remove(id: number): PromiseApiResult {
    return normalize(await this.axios.delete(`${this.getEndpoint()}/${id}`))
  }
}

export default ApiRepository
