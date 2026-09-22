/**
 * Convert the custom tree syntax into Mind-Elixir node data.
 *
 * Example:
 *
 * ZikoJS
 *   @direction: 2
 *   @tags: [ziko, javascript]
 *
 *   @style:
 *     fontSize: 18px
 *     color: #222
 *     background: linear-gradient(red, blue)
 *     fontWeight: bold
 *
 *   - Core
 *     @tags: [core]
 *
 *     - UIElement
 *     - Hooks
 *
 *   - Documentation
 *     @hyperLink: https://zikojs.org
 *
 * @param {string} source
 * @returns {object|null}
 */
export function tree2MindElixirData(source) {
  if (typeof source !== "string") {
    throw new TypeError("Expected a tree string");
  }

  const lines = parseLines(source);

  if (lines.length === 0) {
    return null;
  }

  if (lines[0].type !== "node") {
    throw new SyntaxError(
      `The first line must be a node (line ${lines[0].line})`
    );
  }

  const root = createNode(lines[0].topic);

  // The first node is always the root.
  root.root = true;

  const stack = [
    {
      indent: lines[0].indent,
      node: root,
    },
  ];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    /*
     * ---------------------------------------------------------------
     * Child node
     * ---------------------------------------------------------------
     *
     *   - Core
     *     - UI
     */
    if (line.type === "node") {
      while (
        stack.length > 1 &&
        line.indent <= stack[stack.length - 1].indent
      ) {
        stack.pop();
      }

      const parent = stack[stack.length - 1];

      if (!parent) {
        throw new SyntaxError(
          `Cannot determine parent for node at line ${line.line}`
        );
      }

      parent.node.children ??= [];

      const node = createNode(line.topic);

      parent.node.children.push(node);

      stack.push({
        indent: line.indent,
        node,
      });

      continue;
    }

    /*
     * ---------------------------------------------------------------
     * Node property
     * ---------------------------------------------------------------
     *
     *   @tags: [core, ui]
     *   @direction: 1
     *   @expanded: true
     *
     * Or:
     *
     *   @style:
     *     color: red
     *     background: blue
     */
    if (line.type === "property") {
      const owner = findOwner(stack, line.indent);

      if (!owner) {
        throw new SyntaxError(
          `Property "${line.key}" has no owning node ` +
          `(line ${line.line})`
        );
      }

      const next = lines[i + 1];

      /*
       * Nested property:
       *
       *   @style:
       *     color: red
       *     background: blue
       */
      if (
        line.value === "" &&
        next &&
        next.indent > line.indent
      ) {
        const result = parseNestedValue(
          lines,
          i + 1,
          next.indent
        );

        owner.node[line.key] = result.value;

        // parseNestedValue returns the first line that wasn't consumed.
        i = result.index - 1;

        continue;
      }

      /*
       * Normal property:
       *
       *   @direction: 2
       *   @expanded: true
       *   @tags: [core, ui]
       */
      owner.node[line.key] = parseValue(line.value);

      continue;
    }

    /*
     * A nested property should only be consumed by a
     * preceding @property.
     */
    if (line.type === "nested") {
      throw new SyntaxError(
        `Unexpected nested property "${line.text}" ` +
        `at line ${line.line}`
      );
    }

    throw new SyntaxError(
      `Unexpected syntax at line ${line.line}: ${line.text}`
    );
  }

  return root;
}

/* -------------------------------------------------------------------------- */
/* Lines                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Parse source into normalized lines.
 */
function parseLines(source) {
  return source
    .split(/\r?\n/)
    .map((raw, index) => {
      // Treat tabs as two spaces.
      const expanded = raw.replace(/\t/g, "  ");

      const match = expanded.match(/^\s*/);

      return {
        line: index + 1,
        indent: match?.[0].length ?? 0,
        text: expanded.trim(),
      };
    })
    .filter(({ text }) => {
      // Empty lines and comments are ignored.
      return text !== "" && !text.startsWith("#");
    })
    .map(parseLine);
}

/**
 * Classify a line.
 */
function parseLine(line) {
  const { text } = line;

  /*
   * Child:
   *
   *   - Core
   */
  if (text.startsWith("- ")) {
    return {
      ...line,
      type: "node",
      topic: text.slice(2).trim(),
    };
  }

  /*
   * Node property:
   *
   *   @tags: [core]
   *   @style:
   */
  if (text.startsWith("@")) {
    const index = findColon(text);

    if (index === -1) {
      throw new SyntaxError(
        `Invalid property at line ${line.line}: ${text}`
      );
    }

    return {
      ...line,
      type: "property",
      key: text.slice(1, index).trim(),
      value: text.slice(index + 1).trim(),
    };
  }

  /*
   * Nested property:
   *
   *   color: red
   *   background: blue
   */
  if (findColon(text) !== -1) {
    const index = findColon(text);

    return {
      ...line,
      type: "nested",
      key: text.slice(0, index).trim(),
      value: text.slice(index + 1).trim(),
    };
  }

  /*
   * A line without "-" or "@" is a node.
   *
   * This is what allows the root to simply be:
   *
   *   ZikoJS
   */
  return {
    ...line,
    type: "node",
    topic: text,
  };
}

/* -------------------------------------------------------------------------- */
/* Nested values                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Parse a nested object or array.
 *
 * Object:
 *
 *   @style:
 *     color: red
 *     background: blue
 *
 * Array:
 *
 *   @tags:
 *     - ziko
 *     - javascript
 */
function parseNestedValue(lines, start, indent) {
  const first = lines[start];

  /*
   * Nested array:
   *
   *   @tags:
   *     - core
   *     - ui
   */
  if (first.type === "node" && first.text.startsWith("- ")) {
    const values = [];

    let i = start;

    while (
      i < lines.length &&
      lines[i].indent >= indent &&
      lines[i].type === "node" &&
      lines[i].text.startsWith("- ")
    ) {
      values.push(
        parseValue(lines[i].text.slice(2).trim())
      );

      i++;
    }

    return {
      value: values,
      index: i,
    };
  }

  /*
   * Nested object:
   *
   *   @style:
   *     color: red
   *     background: blue
   */
  const object = {};

  let i = start;

  while (i < lines.length) {
    const line = lines[i];

    /*
     * We've returned to the parent indentation.
     */
    if (line.indent < indent) {
      break;
    }

    /*
     * A deeper indentation belongs to the previous
     * nested property and isn't supported here.
     */
    if (line.indent > indent) {
      throw new SyntaxError(
        `Unexpected indentation at line ${line.line}`
      );
    }

    if (line.type !== "nested") {
      break;
    }

    object[line.key] = parseValue(line.value);

    i++;
  }

  return {
    value: object,
    index: i,
  };
}

/* -------------------------------------------------------------------------- */
/* Values                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Convert a scalar string into a JavaScript value.
 *
 * Strings that aren't special values remain strings.
 *
 * Examples:
 *
 *   true       -> true
 *   false      -> false
 *   null       -> null
 *   42         -> 42
 *   18px       -> "18px"
 *   red        -> "red"
 *   #222       -> "#222"
 */
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

  /*
   * Numbers.
   *
   * CSS values such as "18px" don't match this expression,
   * so they remain strings.
   */
  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    return Number(value);
  }

  /*
   * Inline array:
   *
   *   [ziko, javascript]
   */
  if (value.startsWith("[") && value.endsWith("]")) {
    return parseArray(value);
  }

  /*
   * Quoted string.
   */
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  /*
   * Everything else is a string.
   *
   * This is important for CSS:
   *
   *   background: red
   *   color: #222
   *   fontSize: 18px
   */
  return value;
}

/**
 * Parse an inline array.
 */
function parseArray(value) {
  const content = value.slice(1, -1).trim();

  if (!content) {
    return [];
  }

  return splitArray(content).map(item =>
    parseValue(item.trim())
  );
}

/**
 * Split an inline array while respecting quotes
 * and nested brackets.
 */
function splitArray(value) {
  const result = [];

  let current = "";
  let quote = null;
  let depth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (quote) {
      current += char;

      if (char === quote && value[i - 1] !== "\\") {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }

    if (char === "[" || char === "(" || char === "{") {
      depth++;
      current += char;
      continue;
    }

    if (char === "]" || char === ")" || char === "}") {
      depth--;
      current += char;
      continue;
    }

    if (char === "," && depth === 0) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    result.push(current);
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Find the first ":" outside quotes/brackets.
 *
 * This prevents values such as:
 *
 *   background: linear-gradient(red, blue)
 *   hyperLink: https://zikojs.org
 */
function findColon(text) {
  let quote = null;
  let depth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (quote) {
      if (char === quote && text[i - 1] !== "\\") {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === "[" || char === "(" || char === "{") {
      depth++;
      continue;
    }

    if (char === "]" || char === ")" || char === "}") {
      depth--;
      continue;
    }

    if (char === ":" && depth === 0) {
      return i;
    }
  }

  return -1;
}

/**
 * Find the node owning a property.
 */
function findOwner(stack, indent) {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].indent < indent) {
      return stack[i];
    }
  }

  return null;
}

/**
 * Create a Mind-Elixir node.
 *
 * Uses the Web Crypto API, so there is no dependency on
 * node:crypto or any Node-only module.
 */
function createNode(topic) {
  return {
    topic,
    id: globalThis.crypto.randomUUID(),
  };
}