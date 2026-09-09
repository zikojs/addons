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
    });

    this._width = props.width || window.innerWidth;
    this._height = props.height || window.innerHeight;
    this.renderer = props.renderer || "2D";
    this.p5 = null;
    this.instance = null;

    this.setup();
  }

  setup() {
    // Mount p5 inside `this.element` (the UIElement DOM container)
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
        this.render(p);
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
    this._width = width;
    this._height = height;
    if (this.instance) {
      this.instance.resizeCanvas(width, height);
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