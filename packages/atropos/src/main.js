import { UIElement, tags } from "ziko/dom";
import __Atropos__ from 'atropos';

export class UIAtropos extends UIElement{
    constructor(item){
        super({ name : 'atropos', element : 'div'})
        this.setAttr({class : 'atropos'});
        this.inner = tags.div({class : 'atropos-inner'}).append(item) 
        this.append(
            tags.div({class : 'atropos-scale'}).append(
                tags.div({class : 'atropos-rotate'}).append(
                    this.inner
                )
            )
        )
        this.atropos = __Atropos__({
            el : this.element,
            // activeOffset: 40,
            // shadowScale: 1.05,
            // onEnter() {
            //     console.log('Enter');
            // },
            // onLeave() {
            //     console.log('Leave');
            // },
            // onRotate(x, y) {
            //     console.log('Rotate', x, y);
            // }
        }) 
    }
    destroy(){
        this.atropos.destroy();
        return this;
    }
    onEnter(callback){
        this.atropos.params.onEnter = callback.bind(this, this);
        return this;
    }
    onLeave(callback){
        this.atropos.params.onLeave = callback.bind(this, this);
        return this;
    }
    onRotate(callback){
        this.atropos.params.onRotate = callback;
        // .onRotate((x, y)=> console.log({x, y}))
        return this;
    }
}

export const Atropos = (item) => new UIAtropos(item)