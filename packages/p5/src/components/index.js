/**
 * Base Class for 2D P5 Objects
 */
class P52DObject {
  constructor(props = {}) {
    this.props = { ...props };
    this._translation = { x: 0, y: 0 };
    this._style = {
      fill: props.fill,
      stroke: props.stroke,
      strokeWeight: props.strokeWeight,
      noFill: props.noFill ?? false,
      noStroke: props.noStroke ?? false
    };
  }

  /**
   * Sets local translation offset
   */
  translate(x = 0, y = 0) {
    this._translation = { x, y };
    return this; // Enable method chaining
  }

  /**
   * Configures visual styling properties
   */
  style(options = {}) {
    Object.assign(this._style, options);
    return this; // Enable method chaining
  }

  /**
   * Applies styling and transformations to the p5 instance context
   */
  applyState(p) {
    // Handle Fill
    if (this._style.noFill) {
      p.noFill();
    } else if (this._style.fill) {
      const fillVal = typeof this._style.fill === "function" ? this._style.fill(p) : this._style.fill;
      p.fill(fillVal);
    }

    // Handle Stroke
    if (this._style.noStroke) {
      p.noStroke();
    } else if (this._style.stroke) {
      const strokeVal = typeof this._style.stroke === "function" ? this._style.stroke(p) : this._style.stroke;
      p.stroke(strokeVal);
    }

    if (this._style.strokeWeight) {
      const weightVal = typeof this._style.strokeWeight === "function" 
        ? this._style.strokeWeight(p) 
        : this._style.strokeWeight;
      p.strokeWeight(weightVal);
    }

    // Handle Translation
    const tx = typeof this._translation.x === "function" ? this._translation.x(p) : this._translation.x;
    const ty = typeof this._translation.y === "function" ? this._translation.y(p) : this._translation.y;
    if (tx !== 0 || ty !== 0) {
      p.translate(tx, ty);
    }
  }

  /**
   * Render hook - To be overridden by subclasses
   */
  render(p) {
    // Override in subclass
  }

  /**
   * Main draw runner wrapping render logic in p5.push() and p5.pop()
   */
  draw(p) {
    p.push();
    this.applyState(p);
    this.render(p);
    p.pop();
  }
}

/**
 * Circle Subclass
 */
class P5Circle extends P52DObject {
  constructor(props = {}) {
    super(props);
  }

  render(p) {
    const x = typeof this.props.x === "function" ? this.props.x(p) : (this.props.x ?? p.width / 2);
    const y = typeof this.props.y === "function" ? this.props.y(p) : (this.props.y ?? p.height / 2);
    const d = typeof this.props.d === "function" ? this.props.d(p) : (this.props.d ?? 50);

    p.circle(x, y, d);
  }
}

/**
 * Factory helper function returning a P5Circle instance
 */
export function Circle(props = {}) {
  return new P5Circle(props);
}