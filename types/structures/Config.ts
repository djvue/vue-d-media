import { RepositoryInterface } from './Api'
import { Entity } from './Entity'

export interface ApiConfig {
  baseUrl?: string
  prefix?: string
  headers?: { [name: string]: string }
}

export interface Config {
  types?: string[]
  accept?: { [key: string]: string }
  entities?: Entity[]
  hiddenEntities?: { [entityType: string]: number[] }
  filterLimit?: number
  maxFiles?: number
  maxFilesize?: number
  api?: {
    repository?: RepositoryInterface
    config?: ApiConfig
  }
}

export interface FullApiConfig {
  baseUrl?: string
  prefix: string
  headers: { [name: string]: string }
}

export interface FullConfig {
  types: string[]
  accept: { [key: string]: string }
  entities: Entity[]
  hiddenEntities: { [entityType: string]: number[] }
  filterLimit: number
  maxFiles: number
  maxFilesize: number
  api: {
    repository: RepositoryInterface
    config: FullApiConfig
  }
}
