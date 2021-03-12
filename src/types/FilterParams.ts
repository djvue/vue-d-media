import { FilterEntities } from '@/types/FilterEntities'

export type FilterParams = {
  type: string
  page: number
  limit: number
  search: string
  entities: FilterEntities
}
