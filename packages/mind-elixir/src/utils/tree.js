export function tree2MindElixirData(source) {
  if (typeof source !== "string") {
    throw new TypeError("Expected a tree string");
  }

  const lines = parseLines(source);

  if (!lines.length) {
    return null;
  }

  const rootLine = lines[0];

  if (rootLine.type !== "node") {
    throw new SyntaxError("The first line must be a root node");
  }

  const root = createNode(rootLine.topic);

  const stack = [
    {
      indent: rootLine.indent,
      node: root,
    },
  ];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.type === "property") {
      const owner = findOwner(stack, line.indent);

      if (!owner) {
        throw new SyntaxError(
          `Property "${line.key}" has no owning node`
        );
      }

      if (line.value === "") {
        const next = lines[i + 1];

        if (
          next &&
          next.indent > line.indent &&
          next.type === "mapping"
        ) {
          const { value, consumed } = parseMapping(
            lines,
            i,
            line.indent
          );

          owner.node[line.key] = value;
          i = consumed;
        } else {
          owner.node[line.key] = null;
        }

        continue;
      }

      owner.node[line.key] = parseValue(line.value);
      continue;
    }

    if (line.type === "node") {
      while (
        stack.length > 1 &&
        line.indent <= stack.at(-1).indent
      ) {
        stack.pop();
      }

      const parent = stack.at(-1).node;

      const node = createNode(line.topic);

      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push(node);

      stack.push({
        indent: line.indent,
        node,
      });
    }
  }

  return root;
}

function parseLines(source) {
  return source
    .split(/\r?\n/)
    .map((raw, index) => {
      const expanded = raw.replace(/\t/g, "  ");
      const indent = expanded.match(/^\s*/)[0].length;
      const text = expanded.trim();

      return {
        line: index + 1,
        indent,
        text,
      };
    })
    .filter(line => line.text && !line.text.startsWith("#"))
    .map(line => parseLine(line));
}

function parseLine(line) {
  const { text } = line;

  if (text.startsWith("- ")) {
    return {
      ...line,
      type: "node",
      topic: text.slice(2).trim(),
    };
  }

  if (text.startsWith("@")) {
    const index = text.indexOf(":");

    if (index === -1) {
      throw new SyntaxError(
        `Invalid property at line ${line.line}`
      );
    }

    return {
      ...line,
      type: "property",
      key: text.slice(1, index).trim(),
      value: text.slice(index + 1).trim(),
    };
  }

  return {
    ...line,
    type: "node",
    topic: text,
  };
}

function parseValue(value) {
  if (value === "") {
    return "";
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value === "null") {
    return null;
  }

  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    return Number(value);
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map(x => parseValue(x.trim()));
  }

  return value;
}

function createNode(topic) {
  return {
    topic,
    id: createId(),
  };
}

function findOwner(stack, indent) {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].indent < indent) {
      return stack[i];
    }
  }

  return null;
}

function createId() {
  return `node_${Math.random().toString(36).slice(2, 11)}`;
}