import { UIElement } from "ziko/dom";
import { call_with_optional_props } from "ziko/dom/internal-utils";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { LeafletLayer, Tile, LeafletTile } from "../layers";

export class UILeafletMap extends UIElement {
  constructor(props = {}, ...layers) {
    super({ element: "div" });
    this.props = props;
    this._layers = layers.flat();
    this._map = null;

    const width = props.width || "100%";
    const height = props.height || "400px";

    this.style({
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      position: "relative",
    });

    // Defer initialization to ensure wrapper element has dimensions in DOM
    requestAnimationFrame(() => this.initMap());
  }

  initMap() {
    if (this._map) return;

    const center = this.props.center || [51.505, -0.09];
    const zoom = this.props.zoom ?? 13;

    this._map = L.map(this.element, {
      center,
      zoom,
      zoomControl: this.props.zoomControl ?? true,
      ...this.props.options,
    });

    // Add default OpenStreetMap tiles if no tile layer is provided explicitly
    const hasTileLayer = this._layers.some(
      (l) => l instanceof LeafletTile
    );
    if (!hasTileLayer) {
      Tile().mount(this._map);
    }

    // Mount initial declarative child layers
    this._layers.forEach((layer) => {
      if (layer instanceof LeafletLayer) {
        layer.mount(this._map);
      }
    });
  }

  /**
   * Add dynamic layers to the map after mount
   */
  add(...layers) {
    const validLayers = layers.flat().filter((l) => l instanceof LeafletLayer);
    this._layers.push(...validLayers);

    if (this._map) {
      validLayers.forEach((layer) => layer.mount(this._map));
    }
    return this;
  }

  /**
   * Remove a layer by reference
   */
  remove(layer) {
    const index = this._layers.indexOf(layer);
    if (index !== -1) {
      this._layers[index].unmount();
      this._layers.splice(index, 1);
    }
    return this;
  }

  /**
   * Re-center and change map view dynamically
   */
  setView(center, zoom = this.props.zoom) {
    if (this._map) {
      this._map.setView(center, zoom);
    }
    return this;
  }

  destroy() {
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
    return this;
  }
}

export const LeafletMap = call_with_optional_props(UILeafletMap);