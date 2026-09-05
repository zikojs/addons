import { UIElement } from 'ziko/dom'
import { call_with_optional_props } from 'ziko/dom/internal-utils'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'default'
})

export class UIMermaid extends UIElement {
  constructor({ title = '', theme = 'default', ...config } = {}, code) {
    super({
      element: 'div',
      name: 'ziko-mermaid'
    })

    this.config = {
      title,
      theme,
      ...config
    }

    this.code = code
    this._render()
  }

  _render() {
    const { title, ...mermaidConfig } = this.config

    const id = `mermaid-${crypto.randomUUID().slice(-17)}`

    const definition = Object.keys(mermaidConfig).length
      ? `%%{init: ${JSON.stringify(mermaidConfig)}}%%\n${this.code}`
      : this.code

    mermaid
      .render(id, definition)
      .then(({ svg, bindFunctions }) => {
        this.element.innerHTML = svg

        if (title) {
          this.element.setAttribute('aria-label', title)
        }

        bindFunctions?.(this.element)
      })
      .catch(error => {
        console.error(error)
        this.element.textContent = `Mermaid error: ${error.message}`
      })
  }
}

export const Mermaid = call_with_optional_props(UIMermaid)