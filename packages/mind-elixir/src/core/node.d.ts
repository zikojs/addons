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

  toNodeData(): {
    id: string;
    topic: string;
    expanded: boolean;
    direction?: 0 | 1;
    style?: Record<string, string | number>;
    tags?: string[];
    icons?: string[];
    hyperLink?: string;
    children: ReturnType<UIMindNode["toNodeData"]>[];
    [key: string]: unknown;
  };
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
  data: any
): UIMindNode | null;