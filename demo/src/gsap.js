// GSAP 
import {gsap} from '@zikojs/gsap';
import { tags } from 'ziko/dom'

const { div } = tags;

const Box = (bg) => div().style({
    width : '200px',
    height : '200px',
    background : bg
})

const [el1, el2, el3] = [Box('red'), Box('green'), Box('blue')]

el1.mount(document.body)
el2.mount(document.body)
el3.mount(document.body)

var tl = gsap.timeline({repeat: 2, repeatDelay: 1});

tl.to(el1, {duration: 1, x: 774}, .5)
  .to(el2, {duration: 1, x: 774}, "-=0.75") //overlaps by 0.75 seconds
  .to(el3, {duration: 1, x: 774})

// gsap.to(el, {rotation: 360, x: 100, y:100, duration: 1})

// var tl = gsap.timeline({repeat: 2, repeatDelay: 1});
// tl.to(el1, {x: 100, duration: 1});
// tl.to(el1, {y: 50, duration: 1});
// tl.to(el1, {opacity: 0, duration: 1});

// then we can control the whole thing easily...
// tl.pause();
// tl.resume();
// tl.seek(1.5);
// tl.reverse();