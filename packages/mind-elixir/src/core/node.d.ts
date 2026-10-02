export interface MindElixirNodeData {
  id: string;
  topic: string;
  root?: boolean;
  expanded?: boolean;
  direction?: 0 | 1;
  style?: Record<string, string | number>;
  tags?: string[];
  icons?: string[];
  hyperLink?: string;
  children?: MindElixirNodeData[];
  parent?: MindElixirNodeData;
  [key: string]: unknown;
}

export interface UIMindNodeProps {
  id?: string;
  expanded?: boolean;
  direction?: 0 | 1;
  style?: Record<string, string | number>;
  tags?: string[];
  icons?: string[];
  hyperLink?: string;
  [key: string]: unknown;
}

export class UIMindNode {
  id: string;
  topic: string;
  props: UIMindNodeProps;
  children: UIMindNode[];

  constructor(
    topic: string,
    props?: UIMindNodeProps,
    ...children: Array<UIMindNode | UIMindNode[]>
  );

  toNodeData(): MindElixirNodeData;
}

export function MindNode(
  topic: string,
  props?: UIMindNodeProps,
  ...children: Array<UIMindNode | UIMindNode[]>
): UIMindNode;

export function MindNode(
  topic: string,
  ...children: Array<UIMindNode | UIMindNode[]>
): UIMindNode;

export function dataToMindNodes(
  data: MindElixirNodeData | { nodeData: MindElixirNodeData }
): UIMindNode | null;