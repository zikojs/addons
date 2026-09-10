import { P5Canvas } from "@zikojs/p5";
import { Circle } from "@zikojs/p5";

// function Circle(props = {}) {
//     return (p) => {
//       p.push();
//       if (props.noFill) {
//         p.noFill();
//       } else if (props.fill) {
//         p.fill(props.fill);
//       }
      
//       if (props.stroke) p.stroke(props.stroke);
//       if (props.strokeWeight) p.strokeWeight(props.strokeWeight);

//       const x = typeof props.x === "function" ? props.x(p) : (props.x ?? p.width / 2);
//       const y = typeof props.y === "function" ? props.y(p) : (props.y ?? p.height / 2);
//       const d = typeof props.d === "function" ? props.d(p) : (props.d ?? 50);

//       p.circle(x, y, d);
//       p.pop();
//     };
//   }
globalThis.c = Circle({ x: 0, d: 100, dimMode : 'absolute'}).style({
    fill : 'red',
    stroke : 'green'
})
globalThis.ca = P5Canvas({}, 
    c,
)
.view(-100, 100, -100, 100)
.aspectRatio(1)
// .render()

ca.mount(document.body)