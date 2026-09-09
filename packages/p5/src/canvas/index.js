import { UIElement, tags } from 'ziko/dom'
import { call_with_otional_props } from 'ziko/dom/internal-utils'
export class UIP5Canvas extends UIElement{
    constructor(props, items){
        super({element : 'figure'})
        this.items = items;
    }
    draw(){

    }
}


export const P5Canvas = call_with_otional_props(UIP5Canvas);


