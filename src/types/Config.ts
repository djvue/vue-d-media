import { ApiRepositoryInterface } from '@/types/Api'
import { Entity } from '@/types/Entity'

export type ApiConfig = {
  prefix: string
  headers: { [name: string]: string }
}

export type Config = {
  types: string[]
  accept: { [key: string]: string }
  entities: Entity[]
  hiddenEntities: { [entityType: string]: number[] }
  filterLimit: number
  maxFiles: number
  maxFilesize: number
  api: {
    repository: ApiRepositoryInterface
    config: ApiConfig
  }
}
