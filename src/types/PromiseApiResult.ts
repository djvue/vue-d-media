export type ResponseData = {
  success: boolean
  code: number
  message: string
  data: any
}

export type ApiResult<T> = {
  success: boolean
  code: number
  message: string
  data: T
}

export type PromiseApiResult<T = {}> = Promise<ApiResult<T>>
