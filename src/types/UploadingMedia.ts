export enum UploadingMediaStatus {
  'uploading' = 'uploading',
  'success' = 'success',
  'error' = 'error'
}

export type UploadingMedia = {
  id: number
  url: string
  name: string
  type: string
  size: number
  status: UploadingMediaStatus
  progress: number
  error: string
}
