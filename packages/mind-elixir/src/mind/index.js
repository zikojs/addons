import { UIElement } from "ziko/dom";
import { call_with_optional_props } from "ziko/dom/internal-utils";
import MindElixir from "mind-elixir";
import "mind-elixir/style";

/**
 * Declarative Mind Map Node Class
 */
export class UIMindNode {
  constructor(topic, props = {}, ...children) {
    this.id = props.id || `node_${Math.random().toString(36).substr(2, 9)}`;
    this.topic = topic;
    this.props = props;
    this.children = children.flat().filter((child) => child instanceof UIMindNode);
  }

  /**
   * Converts node hierarchy to Mind-Elixir data format
   */
  toNodeData() {
    const nodeObj = {
      id: this.id,
      topic: this.topic,
      expanded: this.props.expanded ?? true,
      direction: this.props.direction, // 0: left, 1: right (for root main branches)
      style: this.props.style,
      tags: this.props.tags,
      icons: this.props.icons,
      hyperLink: this.props.hyperLink,
      children: this.children.map((child) => child.toNodeData()),
    };

    // Clean up undefined properties for Mind-Elixir
    Object.keys(nodeObj).forEach(
      (key) => nodeObj[key] === undefined && delete nodeObj[key]
    );

    return nodeObj;
  }
}

// Declarative Helper Functions
export const MindNode = (topic, props, ...children) => {
  if (typeof props === "object" && !(props instanceof UIMindNode)) {
    return new UIMindNode(topic, props, ...children);
  }
  // Handles signature without props object: MindNode("Topic", child1, child2)
  return new UIMindNode(
    topic,
    {},
    ...[props, ...children].filter((c) => c instanceof UIMindNode)
  );
};

export const RootNode = MindNode;

/**
 * Main Mind Map Container Component
 */
export class UIMindMapContainer extends UIElement {
  constructor(props = {}, rootNode) {
    super({ element: "div" });
    this.props = props;
    this._rootNode = rootNode instanceof UIMindNode ? rootNode : null;
    this.mind = null;

    const width = props.width || "100%";
    const height = props.height || "500px";

    this.style({
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      position: "relative",
      outline: "none",
    });

    requestAnimationFrame(() => this.initMindMap());
  }

  initMindMap() {
    if (this.mind) return;

    const options = {
      el: this.element,
      direction: this.props.direction ?? MindElixir.SIDE, // LEFT, RIGHT, SIDE
      draggable: this.props.draggable ?? true,
      contextMenu: this.props.contextMenu ?? true,
      toolBar: this.props.toolBar ?? true,
      nodeMenu: this.props.nodeMenu ?? true,
      keypress: this.props.keypress ?? true,
      locale: this.props.locale || "en",
      ...this.props.options,
    };

    this.mind = new MindElixir(options);

    // Initial Data Payload construction
    const nodeData = this._rootNode
      ? this._rootNode.toNodeData()
      : { id: "root", topic: "Root Topic" };

    this.mind.init({
      nodeData,
      linkData: this.props.linkData || {},
    });

    // Attach Event Handlers
    if (this.props.events) {
      Object.entries(this.props.events).forEach(([event, handler]) => {
        this.mind.bus.on(event, handler);
      });
    }
  }

  /**
   * Export the current mind map data structure
   */
  getData() {
    return this.mind ? this.mind.getData() : null;
  }

  /**
   * Select a node by ID dynamically
   */
  selectNode(id) {
    if (this.mind) {
      const el = this.mind.findEle(id);
      if (el) this.mind.selectNode(el);
    }
    return this;
  }

  /**
   * Refresh/re-render the mind map structure
   */
  refresh(newRootNode) {
    if (newRootNode instanceof UIMindNode) {
      this._rootNode = newRootNode;
    }
    if (this.mind && this._rootNode) {
      this.mind.refresh({
        nodeData: this._rootNode.toNodeData(),
      });
    }
    return this;
  }

  destroy() {
    if (this.mind) {
      this.element.innerHTML = "";
      this.mind = null;
    }
    return this;
  }
}

export const MindMap = call_with_optional_props(UIMindMapContainer);