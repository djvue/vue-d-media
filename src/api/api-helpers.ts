// eslint-disable-next-line import/no-named-default
import { AxiosResponse } from 'axios'
import { AxiosResponseData } from '~types/structures/Api'

// : AxiosResponse<ResponseData>
// ResponseData
/* export function normalize(response: AxiosResponse<any>): any {
  return response.data
} */
export function normalize(response: AxiosResponse<AxiosResponseData>): AxiosResponseData {
  // if (response.status === 401) {
  //
  // }
  return response.data
}
