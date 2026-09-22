export function yaml2MindMapRowData(source) {
  if (typeof source !== "string") {
    throw new TypeError("yaml2MindMapRowData() expects a string");
  }

  const lines = source
    .split(/\r?\n/)
    .map((line, index) => ({
      line,
      lineNumber: index + 1,
      content: line.trim(),
      indent: line.match(/^[ \t]*/)[0].replace(/\t/g, "    ").length,
    }))
    .filter(({ content }) => content && !content.startsWith("#"));

  if (!lines.length) return null;

  const createNode = (topic) => ({
    id: `node_${Math.random().toString(36).slice(2, 11)}`,
    topic,
    expanded: true,
    children: [],
  });

  const rootIndent = lines[0].indent;
  const root = createNode(lines[0].content);

  const stack = [
    {
      indent: rootIndent,
      node: root,
    },
  ];

  for (let i = 1; i < lines.length; i++) {
    const { content, indent, lineNumber } = lines[i];

    // Find the parent by indentation.
    while (
      stack.length > 1 &&
      indent <= stack[stack.length - 1].indent
    ) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    // A node cannot be less indented than the root.
    if (indent < rootIndent) {
      throw new Error(
        `Invalid indentation at line ${lineNumber}: "${content}"`
      );
    }

    const node = createNode(content);

    parent.node.children.push(node);

    stack.push({
      indent,
      node,
    });
  }

  return root;
}
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
`
console.log(yaml2MindMapRowData(data))