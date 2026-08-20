export const children2component = children => {
    if(!children.map) return -1
    return children.map(([key, value])=>`tags.${key}(${JSON.stringify(value)})`)
}
