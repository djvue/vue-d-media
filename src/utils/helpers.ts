export const getDataUrl = async (file: File): Promise<string> => new Promise((resolve) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => resolve(reader.result as string))
  reader.readAsDataURL(file)
})

export const wait = async (time: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => resolve(), time)
})
