export class LeafletLayer {
  constructor(type, props = {}, ...children) {
    this.type = type;
    this.props = props;
    this._children = children.flat();
    this.instance = null;
  }

  mount(mapInstance) {
    this.instance = this.createInstance();

    // Attach popups or tooltips if specified in props
    if (this.props.popup) {
      this.instance.bindPopup(this.props.popup);
    }
    if (this.props.tooltip) {
      this.instance.bindTooltip(this.props.tooltip);
    }

    // Attach event listeners (e.g., onClick: () => {})
    if (this.props.events) {
      Object.entries(this.props.events).forEach(([event, handler]) => {
        const leafletEvent = event.startsWith("on")
          ? event.slice(2).toLowerCase()
          : event;
        this.instance.on(leafletEvent, handler);
      });
    }

    this._children.forEach((child) => {
      if (child instanceof LeafletLayer) {
        child.mount(mapInstance);
      }
    });

    this.instance.addTo(mapInstance);
    return this.instance;
  }

  unmount() {
    if (this.instance) {
      this.instance.remove();
      this.instance = null;
    }
  }

  createInstance() {
    // Overridden by specific components
    return null;
  }
}
