import { UIElement } from "ziko/dom";
import { call_with_optional_props } from "ziko/dom/internal-utils";
import confetti from "canvas-confetti";

export class ConfettiEffect {
  constructor(options = {}) {
    this.options = options;
  }

  fire(confettiInstance, overrides = {}) {
    if (typeof confettiInstance === "function") {
      confettiInstance({
        ...this.options,
        ...overrides,
      });
    }
  }
}

export class BurstEffect extends ConfettiEffect {
  constructor(options = {}) {
    super({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      ...options,
    });
  }
}

export class SnowEffect extends ConfettiEffect {
  constructor(options = {}) {
    super({
      particleCount: 1,
      startVelocity: 0,
      ticks: 200,
      gravity: 0.3,
      origin: {
        x: Math.random(),
        y: Math.random() * 0.99 - 0.2,
      },
      colors: ["#ffffff"],
      shapes: ["circle"],
      scalar: 0.8,
      drift: Math.random() - 0.5,
      ...options,
    });
  }
}

export class FireworksEffect extends ConfettiEffect {
  fire(confettiInstance) {
    const duration = this.options.duration || 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confettiInstance({
        ...defaults,
        ...this.options,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);
  }
}

// Component Factory Helpers
export const Burst = (options) => new BurstEffect(options);
export const Snow = (options) => new SnowEffect(options);
export const Fireworks = (options) => new FireworksEffect(options);

/**
 * Main Confetti Wrapper Component
 */
export class UIConfettiCanvas extends UIElement {
  constructor(props = {}, ...effects) {
    super({ element: "canvas" });
    this.props = props;
    this._effects = effects.flat();
    this.confettiInstance = null;

    const width = props.width || "100%";
    const height = props.height || "100%";

    this.style({
      position: props.position || "fixed",
      top: "0",
      left: "0",
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      pointerEvents: "none",
      zIndex: props.zIndex ?? 999,
    });

    requestAnimationFrame(() => this.initCanvas());
  }

  initCanvas() {
    this.confettiInstance = confetti.create(this.element, {
      resize: true,
      useWorker: this.props.useWorker ?? true,
    });

    // Auto-fire initial declarative effects if passed
    this._effects.forEach((effect) => {
      if (effect instanceof ConfettiEffect) {
        effect.fire(this.confettiInstance);
      }
    });
  }

  /**
   * Fires a specific effect preset or raw options object
   */
  fire(effectOrOptions = {}, overrides = {}) {
    if (!this.confettiInstance) return this;

    if (effectOrOptions instanceof ConfettiEffect) {
      effectOrOptions.fire(this.confettiInstance, overrides);
    } else if (typeof effectOrOptions === "object") {
      this.confettiInstance({
        particleCount: 80,
        spread: 60,
        ...effectOrOptions,
        ...overrides,
      });
    }
    return this;
  }

  /**
   * Triggers a burst origin near a specific DOM element (e.g. Button)
   */
  fireFromElement(targetElement, options = {}) {
    if (!this.confettiInstance || !targetElement) return this;

    const rect = targetElement.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    this.fire(options, { origin: { x, y } });
    return this;
  }

  reset() {
    if (this.confettiInstance) {
      this.confettiInstance.reset();
    }
    return this;
  }

  destroy() {
    this.reset();
    this.confettiInstance = null;
    return this;
  }
}

export const Confetti = call_with_optional_props(UIConfettiCanvas);