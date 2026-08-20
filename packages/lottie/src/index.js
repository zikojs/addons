import {UIElement} from "ziko/dom"
import "@lottiefiles/lottie-player"
class UILottiePlayer extends UIElement{
    constructor(src, width, height = width){
        super({element : "lottie-player", name : "LottiePlayer"});
        this.element.src = src;
        if(width) this.size(width,height);
        this.setAttr("aria-label","Lottie animation");
        this.setAttr("aria-describedby",`lottie-player-description-id`);
    }
    play(){
        this.element.play();
        return this;
    }
    pause(){
        this.element.pause();
        return this;
    }
    useControls(use=true){
        this.element.controls=use;
        return this;
    }
    useLoop(use = true){
        this.element.loop=use;
        return this;
    }
    toggleControls(){
        this.element.controls=!this.element.controls;
        return this;
    }
    setMode(mode="normal"){
        this.element.mode=mode;
        return this;
    }
}
export const LottiePlayer=({
    src = "https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json",
    width,
    height
} = {})=>new UILottiePlayer(src,width,height);