import { UIElement } from "ziko/dom";
import "@lottiefiles/lottie-player";

export interface UILottiePlayerOptions {
    src: string;
    width?: number | string;
    height?: number | string;
}

export declare class UILottiePlayer extends UIElement {
    element: HTMLLottiePlayerElement;

    constructor(
        src: string,
        width?: number | string,
        height?: number | string
    );

    play(): this;
    pause(): this;

    useControls(use?: boolean): this;
    useLoop(use?: boolean): this;

    toggleControls(): this;

    setMode(mode?: string): this;
}

export interface LottiePlayerProps {
    src?: string;
    width?: number | string;
    height?: number | string;
}

export declare const LottiePlayer: (
    props?: LottiePlayerProps
) => UILottiePlayer;

/**
 * Lottie Player element interface (from @lottiefiles/lottie-player)
 */
export interface HTMLLottiePlayerElement extends HTMLElement {
    src: string;
    autoplay: boolean;
    loop: boolean;
    controls: boolean;
    mode: string;

    play(): void;
    pause(): void;
}