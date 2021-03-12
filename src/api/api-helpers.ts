// eslint-disable-next-line import/no-named-default
import { default as axios, AxiosResponse } from 'axios'

export type ResponseData = {
  success: boolean
  code: number
  message: string
  data: never
}

// : AxiosResponse<ResponseData>
// ResponseData
/* export function normalize(response: AxiosResponse<any>): any {
  return response.data
} */
export function normalize(response: AxiosResponse<ResponseData>): ResponseData {
  // if (response.status === 401) {
  //
  // }
  return response.data
}

export { axios }
