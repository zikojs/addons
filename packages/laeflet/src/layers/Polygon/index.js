import { LeafletLayer } from '../Layer/index.js'

export class LeafletPolygon extends LeafletLayer {
  createInstance() {
    const positions = this.props.positions || [];
    return L.polygon(positions, this.props);
  }
}
export const Polygon = (props, ...children) => new LeafletPolygon("polygon", props, ...children);
