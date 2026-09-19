// utils/index.js

export const children2component = children => {
  if (!children?.map) return -1

  const tags = new Set()

  const components = children.map(([key, value]) => {
    tags.add(key)
    return `${key}(${JSON.stringify(value)})`
  })

  return [components, tags]
}

export const camel2hyphencase = (text = '') =>
  text.replace(/[A-Z]/g, (match, index) =>
    index ? `-${match.toLowerCase()}` : match.toLowerCase()
  );