export function evaluateValue(val, p, currentValue) {
  if (typeof val === "function") {
    return val(currentValue, p);
  }
  return val;
}

export class P52DObject {
  constructor(props = {}) {
    this.props = { ...props };

    // Transforms internal state
    this._pos = { 
      x: props.x ?? 0, 
      y: props.y ?? 0 
    };
    this._rot = { 
      angle: props.rot ?? 0 
    };
    this._scale = { 
      x: props.scaleX ?? props.scale ?? 1, 
      y: props.scaleY ?? props.scale ?? 1 
    };

    // Dimension control: "relative" | "absolute" | "percentage"
    this._dimMode = props.dimMode ?? props.dimensionMode ?? "relative";

    this._style = {
      fill: props.fill,
      stroke: props.stroke,
      strokeWeight: props.strokeWeight,
      noFill: props.noFill ?? false,
      noStroke: props.noStroke ?? false,
      ellipseMode: props.ellipseMode,
      rectMode: props.rectMode
    };
  }

  // --- GETTERS & SETTERS FOR DIMENSION MODE ---

  get dimMode() {
    return this._dimMode;
  }

  /**
   * Sets dimension mode:
   * .dim("relative")  - Fits canvas view coordinate units (default)
   * .dim("absolute")  - Preserves exact screen pixel sizes
   * .dim("percentage")- Scales as a fraction (0.0 to 1.0) of parent width/height
   */
  dim(mode) {
    if (["relative", "absolute", "percentage"].includes(mode)) {
      this._dimMode = mode;
    }
    return this;
  }

  // --- GETTERS ---

  get px() { return this._pos.x; }
  get py() { return this._pos.y; }
  get rx() { return this._rot.angle; }
  get ry() { return this._rot.angle; }
  get sx() { return this._scale.x; }
  get sy() { return this._scale.y; }

  // --- TRANSFORM METHODS ---

  pos({ x, y } = {}) {
    if (x !== undefined) {
      this._pos.x = typeof x === "function" ? x(this._pos.x) : x;
    }
    if (y !== undefined) {
      this._pos.y = typeof y === "function" ? y(this._pos.y) : y;
    }
    return this;
  }

  rot(val) {
    const angleVal = typeof val === "object" && val !== null ? val.angle : val;
    if (angleVal !== undefined) {
      this._rot.angle = typeof angleVal === "function" ? angleVal(this._rot.angle) : angleVal;
    }
    return this;
  }

  scale(val) {
    if (typeof val === "number" || typeof val === "function") {
      const s = typeof val === "function" ? val(this._scale.x) : val;
      this._scale.x = s;
      this._scale.y = s;
    } else if (typeof val === "object" && val !== null) {
      if (val.x !== undefined) {
        this._scale.x = typeof val.x === "function" ? val.x(this._scale.x) : val.x;
      }
      if (val.y !== undefined) {
        this._scale.y = typeof val.y === "function" ? val.y(this._scale.y) : val.y;
      }
    }
    return this;
  }

  style(options = {}) {
    Object.assign(this._style, options);
    return this;
  }

  /**
   * Resolves raw dimension values to canvas units depending on dimMode
   */
  resolveDimension(val, p, canvas) {
    const evaluated = evaluateValue(val, p, val);
    if (typeof evaluated !== "number") return evaluated;

    switch (this._dimMode) {
      case "absolute": {
        const matrix = p.drawingContext.getTransform();
        const currentScaleX = Math.hypot(matrix.a, matrix.b) || 1;
        return evaluated / currentScaleX;
      }

      case "percentage": {
        const viewWidth = canvas?._viewBounds 
          ? (canvas._viewBounds.xmax - canvas._viewBounds.xmin) 
          : p.width;
        return evaluated * viewWidth;
      }

      case "relative":
      default:
        return evaluated;
    }
  }

  applyState(p) {
    // 1. Context Modes
    if (this._style.ellipseMode) p.ellipseMode(p[this._style.ellipseMode]);
    if (this._style.rectMode) p.rectMode(p[this._style.rectMode]);

    // 2. Fill
    if (this._style.noFill) {
      p.noFill();
    } else if (this._style.fill !== undefined) {
      const fillVal = evaluateValue(this._style.fill, p, null);
      p.fill(fillVal);
    }

    // 3. Stroke & Stroke Weight
    if (this._style.noStroke) {
      p.noStroke();
    } else if (this._style.stroke !== undefined) {
      const strokeVal = evaluateValue(this._style.stroke, p, null);
      p.stroke(strokeVal);
    }

    if (this._style.strokeWeight !== undefined) {
      const weightVal = evaluateValue(this._style.strokeWeight, p, null);
      p.strokeWeight(weightVal);
    }

    // 4. Transforms
    const tx = evaluateValue(this._pos.x, p, this._pos.x);
    const ty = evaluateValue(this._pos.y, p, this._pos.y);
    if (tx !== 0 || ty !== 0) {
      p.translate(tx, ty);
    }

    const rotAngle = evaluateValue(this._rot.angle, p, this._rot.angle);
    if (rotAngle !== 0) {
      p.rotate(rotAngle);
    }

    const sx = evaluateValue(this._scale.x, p, this._scale.x);
    const sy = evaluateValue(this._scale.y, p, this._scale.y);
    if (sx !== 1 || sy !== 1) {
      p.scale(sx, sy);
    }
  }

  render(p, canvas) {
    // Override in subclass
  }

  draw(p, canvas) {
    p.push();
    this.applyState(p);
    this.render(p, canvas);
    p.pop();
  }
}

export class P5Circle extends P52DObject {
  constructor(props = {}) {
    super(props);
    this.d = props.d ?? 10;
  }

  render(p, canvas) {
    const d = this.resolveDimension(this.d, p, canvas);
    p.circle(0, 0, d);
  }
}

export function Circle(props = {}) {
  return new P5Circle(props);
}