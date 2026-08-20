import { gsap as GSAP } from "gsap";
import { UIElement } from 'ziko/dom'

export const gsap = Object.assign({}, GSAP, {
  to(targets, vars, position) {
    return GSAP.to(resolveTargets(targets), vars, position);
  },

  from(targets, vars, position) {
    return GSAP.from(resolveTargets(targets), vars, position);
  },

  fromTo(targets, fromVars, toVars, position) {
    return GSAP.fromTo(
      resolveTargets(targets),
      fromVars,
      toVars,
      position
    );
  },

  timeline(...args) {
    const timeline = GSAP.timeline(...args);

    const to = timeline.to.bind(timeline);
    const from = timeline.from.bind(timeline);
    const fromTo = timeline.fromTo.bind(timeline);
    
    timeline.to = (targets, vars, position) => to(resolveTargets(targets), vars, position);
    timeline.from = (targets, vars, position) => from(resolveTargets(targets), vars, position);

    timeline.fromTo = (targets, fromVars, toVars, position) =>fromTo(
        resolveTargets(targets),
        fromVars,
        toVars,
        position
    );

    return timeline;
  }
});


const resolveTarget = target => target instanceof UIElement ? target?.element : target;
const resolveTargets = targets => Array.isArray(targets)
    ? targets.map(resolveTarget)
    : resolveTarget(targets);