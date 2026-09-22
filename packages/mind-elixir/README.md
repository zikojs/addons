# @zikojs/mind-elixir

Declarative [Mind-Elixir](https://github.com/SSShooter/mind-elixir) integration for [ZikoJS](https://github.com/zikojs/ziko).

`@zikojs/mind-elixir` provides ZikoJS components and utilities for building interactive mind maps using a declarative API, raw Mind-Elixir node data, or a simple indentation-based syntax.

## Features

* Declarative `MindNode` API
* Mind-Elixir integration through ZikoJS
* Support for raw Mind-Elixir `nodeData`
* Indentation-based mind map syntax
* Configurable Mind-Elixir options
* Mind-Elixir events
* Node properties such as `id`, `direction`, `tags`, `style`, `icons`, and `hyperLink`
* Convert mind map data back to `MindNode` objects
* Access the underlying Mind-Elixir instance
* ZikoJS `UIElement` integration

## Installation

```bash
npm install @zikojs/mind-elixir
```

## Basic Usage

```js
import { MindMap, MindNode } from "@zikojs/mind-elixir";

const map = MindMap(
  { height: "400px" },

  MindNode(
    "ZikoJS",
    MindNode("Core"),
    MindNode("Ecosystem"),
    MindNode("Tooling")
  )
);

map.mount(document.body);
```

## Declarative Mind Maps

`MindNode()` can be nested to declaratively construct a mind map.

```js
import { MindMap, MindNode } from "@zikojs/mind-elixir";

const map = MindMap(
  {
    height: "400px",
    direction: 2,
  },

  MindNode(
    "ZikoJS Architecture",
    { id: "root" },

    MindNode(
      "Core UI Engine",
      { direction: 0, tags: ["Core"] },

      MindNode("Virtual DOM-less Architecture"),
      MindNode("Reactive Signals & Getters"),
      MindNode("Hyperscript Support")
    ),

    MindNode(
      "Ecosystem Integrations",
      { direction: 1, tags: ["Integrations"] },

      MindNode("P52DObject (Canvas 2D)"),
      MindNode("UIChartCanvas (Chart.js)"),
      MindNode("UILeafletMap (Maps)"),
      MindNode("UIMindMap (Mind-Elixir)")
    ),

    MindNode(
      "Tooling & Routers",
      { direction: 1 },

      MindNode("UFBR Router"),
      MindNode("@zikojs/server")
    )
  )
);

map.mount(document.body);
```

## Node Properties

Properties can be passed as the second argument to `MindNode()`.

```js
MindNode(
  "Core UI Engine",
  {
    id: "core",
    direction: 0,
    expanded: true,
    tags: ["Core"],
    style: {},
    icons: [],
    hyperLink: "https://example.com",
  }
);
```

Supported properties include:

| Property    | Description                            |
| ----------- | -------------------------------------- |
| `id`        | Unique node identifier                 |
| `expanded`  | Whether the node is initially expanded |
| `direction` | Node direction (`0` left, `1` right)   |
| `style`     | Mind-Elixir node styling               |
| `tags`      | Node tags                              |
| `icons`     | Node icons                             |
| `hyperLink` | Node hyperlink                         |

Additional properties can be passed through the underlying Mind-Elixir data model.

## Raw Node Data

You can also provide Mind-Elixir-compatible node data directly.

```js
const rawNodeData = {
  id: "root",
  topic: "Direct Object Input",
  children: [
    {
      id: "sub1",
      topic: "Subtopic",
    },
  ],
};

const map = MindMap(
  { height: "400px" },
  rawNodeData
);

map.mount(document.body);
```

This is useful when your mind map data already comes from JSON, an API, a database, or another application.

## Indentation-Based Syntax

For simpler mind maps, `yaml2MindMapRowData()` converts an indentation-based text representation into Mind-Elixir node data.

```js
import {
  MindMap,
  yaml2MindMapRowData,
} from "@zikojs/mind-elixir";

const data = `
Root
  Child 1
    Nested 11
    Nested 12
  Child 2
    Nested 21
    Nested 22
  Child 3
    Nested 31
`;

const map = MindMap(
  { height: "400px" },
  yaml2MindMapRowData(data)
);

map.mount(document.body);
```

The indentation defines the hierarchy:

```text
Root
├── Child 1
│   ├── Nested 11
│   └── Nested 12
├── Child 2
│   ├── Nested 21
│   └── Nested 22
└── Child 3
    └── Nested 31
```

### Comments

Empty lines are ignored, and lines beginning with `#` can be ignored by the parser.

```text
# Main topic
ZikoJS
  # Core
  Core
    UI
    Hooks
  Ecosystem
    Server
    Router
```

## Mind Map Options

Options passed to `MindMap()` are forwarded to the Mind-Elixir instance.

```js
const map = MindMap(
  {
    height: "500px",

    direction: 2,

    draggable: true,
    contextMenu: true,
    toolBar: true,
    nodeMenu: true,
    keypress: true,

    locale: "en",
  },

  MindNode(
    "My Project",
    MindNode("Frontend"),
    MindNode("Backend")
  )
);
```

### Direction

Mind-Elixir supports different layout directions.

```js
MindMap({
  direction: 2,
}, root);
```

For individual nodes:

```js
MindNode(
  "Left Branch",
  { direction: 0 }
);

MindNode(
  "Right Branch",
  { direction: 1 }
);
```

## Events

Mind-Elixir events can be registered through the `events` option.

```js
const map = MindMap(
  {
    height: "400px",

    events: {
      selectNode: (node) => {
        console.log("Selected node:", node);
      },

      // Other Mind-Elixir events can be registered here.
    },
  },

  MindNode(
    "Root",
    MindNode("Child")
  )
);

map.mount(document.body);
```

## Accessing Mind-Elixir Data

The `MindMap` component exposes `getData()`.

```js
const map = MindMap(
  {},
  MindNode(
    "Root",
    MindNode("Child")
  )
);

map.mount(document.body);

const data = map.getData();

console.log(data);
```

The returned object is the native Mind-Elixir data structure.

## Convert Data Back to Mind Nodes

`getMindNodes()` converts the current Mind-Elixir data into `UIMindNode` objects.

```js
const nodes = map.getMindNodes();

console.log(nodes);
```

This can be useful when you want to move between the declarative ZikoJS representation and the native Mind-Elixir representation.

## Refreshing a Mind Map

You can replace the current node tree with `refresh()`.

```js
const map = MindMap(
  {},
  MindNode(
    "Initial Root",
    MindNode("Child")
  )
);

map.mount(document.body);

map.refresh(
  MindNode(
    "New Root",
    MindNode("New Child")
  )
);
```

Raw node data can also be supplied:

```js
map.refresh({
  id: "root",
  topic: "New Root",
  children: [
    {
      id: "child",
      topic: "New Child",
    },
  ],
});
```

## Destroy

Destroy the underlying mind map:

```js
map.destroy();
```

## Complete Example

```js
import {
  MindMap,
  MindNode,
  yaml2MindMapRowData,
} from "@zikojs/mind-elixir";

const data = `
ZikoJS
  Core
    UI Engine
    Hooks
    DOM
  Ecosystem
    Server
    Router
    MDX
  Integrations
    Three.js
    Chart.js
    Mind-Elixir
`;

const map = MindMap(
  {
    height: "500px",
    direction: 2,

    events: {
      selectNode: (node) => {
        console.log("Selected:", node);
      },
    },
  },

  yaml2MindMapRowData(data)
);

map.mount(document.body);
```

## API

### `MindMap(props?, data?)`

Creates a ZikoJS Mind-Elixir component.

```js
MindMap(props?, data?)
```

`data` can be:

* a `MindNode`
* a Mind-Elixir-compatible node data object

### `MindNode(topic, props?, ...children)`

Creates a declarative mind map node.

```js
MindNode(
  "Topic",
  { id: "topic" },
  MindNode("Child")
);
```

### `yaml2MindMapRowData(source)`

Converts indentation-based mind map text into Mind-Elixir node data.

```js
const data = yaml2MindMapRowData(`
Root
  Child
    Nested
`);
```

### `map.getData()`

Returns the current Mind-El
