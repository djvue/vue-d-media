import { FilterEntities } from '@/types/FilterEntities'

export type Media = {
  id: number
  url: string
  name: string
  altText: string
  caption: string
  humanSize: string
  size: number
  mimeType: string
  width: number
  height: number
  entities: FilterEntities
}
