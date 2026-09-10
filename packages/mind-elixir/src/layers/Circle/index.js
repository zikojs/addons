import { LeafletLayer } from '../Layer/index.js'
export class LeafletCircle extends LeafletLayer {
  createInstance() {
    const [lat, lng] = this.props.center || [0, 0];
    const radius = this.props.radius || 100;
    return L.circle([lat, lng], { radius, ...this.props });
  }
}

export const Circle = (props, ...children) => new LeafletCircle("circle", props, ...children);
