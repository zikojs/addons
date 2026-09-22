import { MindMap, MindNode, tree2MindElixirData } from "@zikojs/mind-elixir";

// Declarative Mind Map Construction
const map = MindMap(
  {
    height: "400px",
    direction: 2, // Side layout
    events: {
      selectNodes: (node) => console.log("Selected node:", node),
    },
  },
  // Root Node
  MindNode(
    "ZikoJS Architecture",
    { id: "root" },

    // Branch 1
    MindNode(
      "Core UI Engine",
      { direction: 0, tags: ["Core"] },
      MindNode("Virtual DOM-less Architecture"),
      MindNode("Reactive Signals & Getters"),
      MindNode("Hyperscript Support")
    ),

    // Branch 2
    MindNode(
      "Ecosystem Integrations",
      { direction: 1, tags: ["Integrations"] },
      MindNode("P52DObject (Canvas 2D)"),
      MindNode("UIChartCanvas (Chart.js)"),
      MindNode("UILeafletMap (Maps)"),
      MindNode("UIMindMap (Mind-Elixir)")
    ),

    // Branch 3
    MindNode(
      "Tooling & Routers",
      { direction: 1 },
      MindNode("UFBR Router"),
      MindNode("@zikojs/server"),
      MindNode(
  "Core UI Engine---------------",
  {
    id: "core",
    direction: 0,
    expanded: true,
    tags: ["Core"],
    style: {},
    icons: [],
    hyperLink: "https://example.com",
  }
)
    )
  )
);

// Append to DOM
map.mount(document.body);

const rawNodeData = {
  id: "root_2",
  topic: "Direct Object Input",
  children: [{ id: "sub1", topic: "Subtopic" }]
};

// const map2 = MindMap({ height: "400px" }, rawNodeData);
// map2.mount(document.body);

const data = `
Root
  Child 1
    @tags: [ziko]
    @hyperLink : #

    @style :
      background: orange
    Nested 11
    Nested 12
  Child 2
    Nested 21
    Nested 22
  Child 3
    Nested 31
`
// console.log()

// const map3 = MindMap({ height: "400px" }, tree2MindElixirData(data));
// map3.mount(document.body);

const yamlData = `

`