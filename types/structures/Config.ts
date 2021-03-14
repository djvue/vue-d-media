import { RepositoryInterface } from './Api'
import { Entity } from './Entity'

export interface ApiConfig {
  prefix: string
  headers: { [name: string]: string }
}

export interface Config {
  types: string[]
  accept: { [key: string]: string }
  entities: Entity[]
  hiddenEntities: { [entityType: string]: number[] }
  filterLimit: number
  maxFiles: number
  maxFilesize: number
  api: {
    repository: RepositoryInterface
    config: ApiConfig
  }
}
