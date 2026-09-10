import { tags } from "ziko/dom";
import {
  Confetti,
  Burst,
  Fireworks,
} from "../../packages/confetti/src";

const { button : btn} = tags

// 1. Fullscreen Overlay Canvas
const overlay = Confetti({ position: "fixed", zIndex: 1000 });
overlay.mount(document.body);

// 2. Trigger Burst on Click
const triggerBtn = btn("Celebrate!")
  .style({ padding: "10px 20px", fontSize: "16px" })
  .onClick(() => {
    // Fire burst directly centered on the button
    overlay.fireFromElement(triggerBtn.element, Burst({ particleCount: 120 }));
  });

// 3. Trigger Fireworks preset on demand
const fireworksBtn = btn("Launch Fireworks")
  .onClick(() => {
    overlay.fire(Fireworks({ duration: 4000 }));
  });

triggerBtn.mount(document.body);
fireworksBtn.mount(document.body);