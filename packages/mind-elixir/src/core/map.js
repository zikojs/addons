import { UIElement } from "ziko/dom";
import { call_with_optional_props } from "ziko/dom/internal-utils";
import MindElixir from "mind-elixir";
import { UIMindNode } from "./node.js";
import { dataToMindNodes } from "./node.js";

export class UIMindMap extends UIElement {
  constructor(props = {}) {
    super({ element: "div" });
    this.props = props;
    this.mind = null;

    const inputData = props.data;

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

    requestAnimationFrame(() => this.render());
  }

  render() {
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

  getData() {
    return this.mind ? this.mind.getData() : null;
  }

  getMindNodes() {
    const raw = this.getData();
    return raw ? dataToMindNodes(raw) : null;
  }

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

export const MindMap = call_with_optional_props(UIMindMap);