import { Mermaid } from '@zikojs/mermaid'

globalThis.m = Mermaid(
    {
        theme : 'forest',
        title : 'Test',
        fontFamily : 'verdana',
        type : 'flowchart',
        direction : 'TD'
    },
     `
          A[Zikojs] --> B[Component]
          B --> C[DOM]
          C --> D[Browser]
      `
).mount(document.body)