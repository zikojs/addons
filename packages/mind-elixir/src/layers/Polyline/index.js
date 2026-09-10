import { LeafletLayer } from '../Layer/index.js'

export class LeafletPolyline extends LeafletLayer {
  createInstance() {
    const positions = this.props.positions || [];
    return L.polyline(positions, this.props);
  }
}

export const Polyline = (props, ...children) => new LeafletPolyline("polyline", props, ...children);