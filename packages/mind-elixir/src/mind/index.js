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
      direction: this.props.direction, // 0: left, 1: right (for main root branches)
      style: this.props.style,
      tags: this.props.tags,
      icons: this.props.icons,
      hyperLink: this.props.hyperLink,
      children: this.children.map((child) => child.toNodeData()),
    };

    // Clean up undefined properties
    Object.keys(nodeObj).forEach(
      (key) => nodeObj[key] === undefined && delete nodeObj[key]
    );

    return nodeObj;
  }
}

// Declarative Factory Helper
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

export const RootNode = MindNode;

/**
 * Converter utility: Transforms raw Mind-Elixir node data into a UIMindNode tree
 */
export function dataToMindNodes(data) {
  if (!data) return null;

  // Handle full getData() envelope or raw nodeData
  const node = data.nodeData ? data.nodeData : data;

  const { id, topic, children, ...props } = node;

  const childNodes = Array.isArray(children)
    ? children.map((child) => dataToMindNodes(child)).filter(Boolean)
    : [];

  return MindNode(topic, { id, ...props }, ...childNodes);
}

/**
 * Main Mind Map Container Component
 */
export class UIMindMapContainer extends UIElement {
  constructor(props = {}, target) {
    super({ element: "div" });
    this.props = props;
    this.mind = null;

    // Resolve initial root node from declarative component, props.data, or raw object target
    const inputData = props.data || target;

    if (inputData instanceof UIMindNode) {
      this._rootNode = inputData;
    } else if (typeof inputData === "object" && inputData !== null) {
      this._rootNode = dataToMindNodes(inputData);
    } else {
      this._rootNode = null;
    }

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
      direction: this.props.direction ?? MindElixir.SIDE,
      draggable: this.props.draggable ?? true,
      contextMenu: this.props.contextMenu ?? true,
      toolBar: this.props.toolBar ?? true,
      nodeMenu: this.props.nodeMenu ?? true,
      keypress: this.props.keypress ?? true,
      locale: this.props.locale || "en",
      ...this.props.options,
    };

    this.mind = new MindElixir(options);

    const nodeData = this._rootNode
      ? this._rootNode.toNodeData()
      : { id: "root", topic: "Root Topic" };

    this.mind.init({
      nodeData,
      linkData: this.props.linkData || {},
    });

    if (this.props.events) {
      Object.entries(this.props.events).forEach(([event, handler]) => {
        // ✅ Correct
        if (typeof this.mind.bus.addListener === "function") {
          this.mind.bus.addListener(event, handler);
        } else if (typeof this.mind.bus.on === "function") {
          this.mind.bus.on(event, handler);
        }
      });
    }
  }

  /**
   * Export raw mind map state
   */
  getData() {
    return this.mind ? this.mind.getData() : null;
  }

  /**
   * Export current state as a declarative UIMindNode tree
   */
  getMindNodes() {
    const raw = this.getData();
    return raw ? dataToMindNodes(raw) : null;
  }

  /**
   * Refresh/re-render map using either UIMindNode or raw data object
   */
  refresh(newData) {
    if (newData instanceof UIMindNode) {
      this._rootNode = newData;
    } else if (typeof newData === "object" && newData !== null) {
      this._rootNode = dataToMindNodes(newData);
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