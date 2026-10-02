export class UIMindNode {
  constructor(topic, props = {}, ...children) {
    this.id = props.id || `node_${Math.random().toString(36).substr(2, 9)}`;
    this.topic = topic;
    this.props = props;
    this.children = children.flat().filter((child) => child instanceof UIMindNode);
  }

  toNodeData() {
    const nodeObj = {
      id: this.id,
      topic: this.topic,
      expanded: this.props.expanded ?? true,
      direction: this.props.direction, // 0: left, 1: right (for main root branches)
      style: this.props.style,
      tags: this.props.tags,
      icons: this.props.icons,
      hyperLink: this.props.hyperLink,
      children: this.children.map((child) => child.toNodeData()),
    };

    Object.keys(nodeObj).forEach(
      (key) => nodeObj[key] === undefined && delete nodeObj[key]
    );

    return nodeObj;
  }
}

export const MindNode = (topic, props, ...children) => {
  if (typeof props === "object" && !(props instanceof UIMindNode)) {
    return new UIMindNode(topic, props, ...children);
  }
  return new UIMindNode(
    topic,
    {},
    ...[props, ...children].filter((c) => c instanceof UIMindNode)
  );
};

export function dataToMindNodes(data) {
  if (!data) return null;

  const node = data.nodeData ? data.nodeData : data;

  const { id, topic, children, ...props } = node;

  const childNodes = Array.isArray(children)
    ? children.map((child) => dataToMindNodes(child)).filter(Boolean)
    : [];

  return MindNode(topic, { id, ...props }, ...childNodes);
}

