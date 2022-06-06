export const resize = (
  vue: any,
  path: string,
  width?: number|null,
  height?: number|null,
  format?: 'jpeg'|'png'|'webp'|null,
  method?: 'cover'|'fit'|'crop'|'resize'|null,
  quality?: number|null,
) => {
  if (typeof (vue as unknown as { $resize: never }).$resize === 'function') {
    return (
      (vue as unknown as { $resize: never }).$resize as (
        path: string,
        width?: number|null,
        height?: number|null,
        format?: 'jpeg'|'png'|'webp'|null,
        method?: 'cover'|'fit'|'crop'|'resize'|null,
        quality?: number|null,
      ) => string
    )(path, width, height, format, method, quality)
  }
  return path
}
