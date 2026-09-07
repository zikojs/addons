import { UIElement } from 'ziko/dom'
import { call_with_optional_props } from 'ziko/dom/internal-utils'

import mermaid from 'mermaid'
import YAML from 'yaml'

mermaid.initialize({
  startOnLoad: false,
  theme: 'default'
})

export class UIMermaid extends UIElement {
  constructor({ title = '', type = '', direction = '', ...rest } = {}, code = '') {
    super({
      element: 'div',
      name: 'ziko-mermaid'
    })

    this.config = {
      title,
      type,
      direction,
      ...rest
    }

    this.code = code
    this.render()
  }

  render() {
    const { title, type, direction, ...configProps } = this.config

    const id = `mermaid-${crypto.randomUUID().slice(-17)}`

    let definition = ''

    // 1. Frontmatter generation
    if (title || Object.keys(configProps).length) {
      const frontmatterObject = {
        ...(title && { title }),
        ...(Object.keys(configProps).length && { config: configProps })
      }

      const frontmatter = YAML.stringify(frontmatterObject)
      definition += `---\n${frontmatter}---\n`
    }

    // 2. Prepend diagram type and direction if provided separately from code
    if (type) {
      definition += `${type}${direction ? ' ' + direction : ''}\n`
    }

    const cleanCode = this.code
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .join('\n  ')

    definition += cleanCode

    mermaid
      .render(id, definition)
      .then(({ svg, bindFunctions }) => {
        this.element.innerHTML = svg
        bindFunctions?.(this.element)
      })
      .catch(error => {
        console.error(error)
        this.element.textContent = `Mermaid error: ${error.message}`
      })
  }
}

export const Mermaid = call_with_optional_props(UIMermaid)