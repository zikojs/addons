# @zikojs/gsap

is a lightweight adapter that adds ZikoJS UIElement support to GSAP.

The GSAP API remains the same. The only difference is that UIElement and UIElement[] can now be used directly as animation targets.

## install

```bash
npm i @zikojs/gsap
```
Usage

Instead of manually accessing the underlying DOM element:

```js
import { gsap } from "gsap";
gsap.to(box.element, {
  x: 100,
  duration: 1
});
```

you can pass the `UIElement` directly:

```js
import { gsap } from "@zikojs/gsap";
gsap.to(box, {
  x: 100,
  duration: 1
});
```

## Features

***🎯 UIElement targets*** : Use ZikoJS UIElement directly as a GSAP target.
***📦 UIElement arrays*** : Animate UIElement[] without manually accessing .element.
***🔀 Mixed targets*** : Combine UIElement and HTMLElement targets.
***🧩 Same GSAP API*** : No new syntax or alternative animation API.
***🔌 Drop-in adapter*** : Works as a thin layer on top of GSAP.
***🌐 Native DOM support*** : Existing HTMLElement targets continue to work.
***⏱️ Timeline support*** : Use UIElement targets with GSAP timelines.
***🪶 Lightweight*** : Only adapts targets; GSAP handles the animation itself.