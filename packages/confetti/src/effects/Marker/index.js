import { LeafletLayer } from '../Layer/index.js'

export class LeafletMarker extends LeafletLayer {
  createInstance() {
    const [lat, lng] = this.props.position || [0, 0];
    const options = { ...this.props };
    if (this.props.icon) {
      options.icon = L.icon(this.props.icon);
    }
    return L.marker([lat, lng], options);
  }
}

export const Marker = (props, ...children) => new LeafletMarker("marker", props, ...children);
