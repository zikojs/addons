import { UIElement } from "ziko/dom";
import { call_with_optional_props } from "ziko/dom/internal-utils";
import p5 from "p5";

export class UIP5Canvas extends UIElement {
  constructor(props = {}, ...items) {
    super({ element: "div" });
    this.props = props;
    this._items = items.flat();

    this.style({
      border: "2px darkblue solid",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      overflow: "hidden",
    });

    this._aspectRatio = props.aspectRatio || null;
    this.renderer = props.renderer || "2D";
    this.p5 = null;
    this.instance = null;

    const initialWidth = props.width || window.innerWidth;
    const initialHeight = props.height || window.innerHeight;

    this._containerWidth = initialWidth;
    this._containerHeight = initialHeight;

    const [w, h] = this._computeDimensions(initialWidth, initialHeight);
    this._width = w;
    this._height = h;

    this._viewBounds = props.view || null;

    this.setup();
  }

  _computeDimensions(containerWidth, containerHeight) {
    if (!this._aspectRatio) return [containerWidth, containerHeight];

    let w = containerWidth;
    let h = containerWidth / this._aspectRatio;

    if (h > containerHeight) {
      h = containerHeight;
      w = containerHeight * this._aspectRatio;
    }

    return [w, h];
  }

  aspectRatio(ratio) {
    if (ratio === undefined) return this._aspectRatio;
    this._aspectRatio = ratio;
    this.resize(this._containerWidth, this._containerHeight);
    return this;
  }

  setup() {
    this.p5 = new p5((p) => {
      this.instance = p;
      p.setup = () => {
        const mode = this.renderer === "WEBGL" ? p.WEBGL : p.P2D;
        p.createCanvas(this._width, this._height, mode);
        if (typeof this.props.setup === "function") {
          this.props.setup(p);
        }
      };
      p.draw = () => {
        this.background(p);
        p.push();
        this.applyViewTransform(p);
        this.render(p);
        p.pop();
        if (typeof this.props.draw === "function") {
          this.props.draw(p);
        }
      };
      p.windowResized = () => {
        if (typeof this.props.onResize === "function") {
          this.props.onResize(p);
        } else {
          this.resize();
        }
      };
    }, this.element);
  }

  view(xmin, xmax, ymin, ymax, options = {}) {
    this._viewBounds = {
      xmin,
      xmax,
      ymin,
      ymax,
      preserveAspectRatio: options.preserveAspectRatio ?? true,
    };
    return this;
  }

  resetView() {
    this._viewBounds = null;
    return this;
  }

  applyViewTransform(p) {
    if (!this._viewBounds) return;
    let { xmin, xmax, ymin, ymax, preserveAspectRatio } = this._viewBounds;
    let sx = this._width / (xmax - xmin);
    let sy = this._height / (ymax - ymin);
    if (preserveAspectRatio) {
      const minScale = Math.min(Math.abs(sx), Math.abs(sy));
      sx = Math.sign(sx) * minScale;
      sy = Math.sign(sy) * minScale;
    }
    p.scale(sx, -sy);
    p.translate(-xmin, -ymax);
  }

  background(p) {
    if (typeof this.props.background !== "undefined") {
      const bg =
        typeof this.props.background === "function"
          ? this.props.background(p)
          : this.props.background;
      p.background(bg);
    } else {
      p.background(17);
    }
  }

  render(p) {
    for (const drawable of this._items) {
      if (typeof drawable === "function") {
        drawable(p);
      } else if (drawable && typeof drawable.draw === "function") {
        drawable.draw(p);
      }
    }
  }

  add(...drawables) {
    const validDrawables = drawables.flat().filter(
      (item) =>
        typeof item === "function" || (item && typeof item.draw === "function")
    );
    this._items.push(...validDrawables);
    return this;
  }

  remove(drawable) {
    const index = this._items.indexOf(drawable);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
    return this;
  }

  resize(width = window.innerWidth, height = window.innerHeight) {
    this._containerWidth = width;
    this._containerHeight = height;
    this.style({
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
    });
    const [w, h] = this._computeDimensions(width, height);
    this._width = w;
    this._height = h;
    if (this.instance) {
      this.instance.resizeCanvas(w, h);
    }
    return this;
  }

  clear() {
    this._items.length = 0;
    return this;
  }

  destroy() {
    this.p5?.remove();
    this.p5 = null;
    this.instance = null;
    return this;
  }
}

export const P5Canvas = call_with_optional_props(UIP5Canvas);