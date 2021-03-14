export type Entity = {
  id: number
  name: string
  type: string
  options: { id: number, name: string }[]
  allowMultiple: boolean
}
