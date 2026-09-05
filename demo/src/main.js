import { Mermaid } from '@zikojs/mermaid'

globalThis.m = Mermaid(
    {
        theme : 'forest',
        title : 'ttt',
        // flowchart: {
        //     curve: 'basis'
        // },
        fontFamily : 'verdana',
    },
     `
        flowchart LR

          A[VanJS] --> B[Component]
          B --> C[DOM]
          C --> D[Browser]
      `
).mount(document.body)