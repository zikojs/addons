import { motion as originalMotion } from "framer-motion";
import { UIElement } from "ziko/dom";

const resolveTarget = (target) => (target instanceof UIElement ? target?.element : target);

/**
 * Wraps a motion component or HTML tag to unpack Ziko UIElement instances in props/ref
 */
const wrapComponent = (Component) => {
  return (props) => {
    const resolvedProps = { ...props };

    // Resolve target element inside ref if passed as UIElement
    if (resolvedProps.ref && resolvedProps.ref instanceof UIElement) {
      resolvedProps.ref = resolveTarget(resolvedProps.ref);
    }

    return Component(resolvedProps);
  };
};

// Proxy to dynamically capture motion.div, motion.span, motion(Component), etc.
export const motion = new Proxy(originalMotion, {
  get(target, prop) {
    const orig = target[prop];
    return typeof orig === "function" ? wrapComponent(orig) : orig;
  },
  apply(target, thisArg, argArray) {
    const Component = target(...argArray);
    return wrapComponent(Component);
  }
});

/**
 * Adapter for Motion core animation utilities (e.g. animate)
 */
export function animate(target, keyframes, options) {
  const resolved = Array.isArray(target)
    ? target.map(resolveTarget)
    : resolveTarget(target);

  return originalMotion.animate
    ? originalMotion.animate(resolved, keyframes, options)
    : null;
}