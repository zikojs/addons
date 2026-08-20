// GSAP 
import {gsap} from '@zikojs/gsap';
import { tags } from 'ziko/dom'

const { div } = tags;

const el = div().style({
    width : '200px',
    height : '200px',
    background : 'red'
})

el.mount(document.body)

gsap.to(el, {rotation: 360, x: 100, duration: 1});