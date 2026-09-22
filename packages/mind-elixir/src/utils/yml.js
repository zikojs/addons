import YAML from "yaml";

export function yaml2MindElixirData(source) {
  if (typeof source !== "string") {
    throw new TypeError("Expected a YAML string");
  }

  const data = YAML.parse(source);

  const nodes = Array.isArray(data) ? data : [data];

  if (!nodes.length) {
    return null;
  }

  const root = normalizeNode(nodes[0]);

  root.root = true;

  if (nodes.length > 1) {
    root.children ??= [];

    for (const node of nodes.slice(1)) {
      root.children.push(normalizeNode(node));
    }
  }

  return root;
}

function normalizeNode(node, parent = undefined) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    throw new TypeError("Mind-Elixir node must be an object");
  }

  if (typeof node.topic !== "string") {
    throw new TypeError("Mind-Elixir node must have a string topic");
  }

  const result = {
    ...node,
    id: node.id ?? crypto.randomUUID(),
  };

  if (node.children) {
    if (!Array.isArray(node.children)) {
      throw new TypeError(
        `"children" must be an array for node "${node.topic}"`
      );
    }

    result.children = node.children.map(child =>
      normalizeNode(child, result)
    );
  }

  if (parent) {
    result.parent = parent;
  }

  return result;
}