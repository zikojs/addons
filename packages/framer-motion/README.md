# @zikojs/motion

A lightweight adapter that adds ZikoJS UIElement support to Motion / Framer Motion.

The Motion API remains the same. The only difference is that `UIElement` and `UIElement[]` can now be used directly as animation targets.

## install

```bash
npm i @zikojs/motion
```
Usage

Instead of manually accessing the underlying DOM element:

```js
import { animate } from "framer-motion";

animate(box.element, { x: 100 }, { duration: 1 });
```

you can pass the `UIElement` directly:

```js
import { animate } from "@zikojs/motion";

animate(box, { x: 100 }, { duration: 1 });
```

## Features

- ***🎯 UIElement targets*** : Use ZikoJS UIElement directly as a motion target.
- ***📦 UIElement arrays*** : Animate UIElement[] without manually accessing .element.
- ***🔀 Mixed targets*** : Combine UIElement and HTMLElement targets.
- ***🧩 Same motion API*** : No new syntax or alternative animation API.
- ***🔌 Drop-in adapter*** : Works as a thin layer on top of motion.
- ***🌐 Native DOM support*** : Existing HTMLElement targets continue to work.
- ***🪶 Lightweight*** : Only adapts targets; motion handles the animation itself.