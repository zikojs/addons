import { UIElement } from "ziko/dom";
import MindElixir from "mind-elixir";
import { UIMindNode, MindNodeData } from "./node.js";

export interface UIMindMapEvents {
  [event: string]: (...args: any[]) => void;
}

export interface UIMindMapOptions {
  [key: string]: unknown;
}

export interface UIMindMapProps {
  data?: UIMindNode | MindNodeData | { nodeData: MindNodeData };

  width?: string | number;
  height?: string | number;

  direction?: number;
  draggable?: boolean;
  contextMenu?: boolean;
  toolBar?: boolean;
  nodeMenu?: boolean;
  keypress?: boolean;
  locale?: string;

  options?: UIMindMapOptions;
  linkData?: Record<string, unknown>;
  events?: UIMindMapEvents;

  [key: string]: unknown;
}

export class UIMindMap extends UIElement {
  props: UIMindMapProps;
  mind: MindElixir | null;
  _rootNode: UIMindNode | null;

  constructor(props?: UIMindMapProps);

  render(): void;

  getData(): unknown | null;

  getMindNodes(): UIMindNode | null;

  refresh(newData: UIMindNode | MindNodeData | { nodeData: MindNodeData }): this;

  destroy(): this;
}

export function MindMap(
  props?: UIMindMapProps,
  ...children: UIMindNode[]
): UIMindMap;

export function MindMap(
  ...children: UIMindNode[]
): UIMindMap;