import { UIMindNode } from "../core/node.js";

export interface MindElixirNodeData {
  id: string;
  topic: string;
  root?: boolean;
  children?: MindElixirNodeData[];
  parent?: MindElixirNodeData;

  [key: string]: unknown;
}

export function yaml2MindElixirData(
  source: string
): MindElixirNodeData | null;

export function yaml2MindNodes(
  source: string
): UIMindNode | null;