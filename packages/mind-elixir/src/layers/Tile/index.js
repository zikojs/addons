import { LeafletLayer } from '../Layer/index.js'

export class LeafletTile extends LeafletLayer {
  createInstance() {
    const url =
      this.props.url ||
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    return L.tileLayer(url, {
      attribution:
        this.props.attribution ||
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ...this.props,
    });
  }
}

export const Tile = (props) => new LeafletTile("tile", props);

