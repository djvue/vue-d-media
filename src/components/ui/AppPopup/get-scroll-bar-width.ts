export const getScrollBarWidth = () => {
  if (document.body.scrollHeight === document.body.clientHeight) {
    return 0
  }
  const element = document.createElement('div')
  Object.assign(element.style, {
    overflow: 'scroll',
    width: '100px',
    height: '100px',
    position: 'absolute',
    top: '-500px'
  })
  document.body.appendChild(element)
  const scrollbarWidth = element.offsetWidth - element.clientWidth
  document.body.removeChild(element)
  return scrollbarWidth
}
