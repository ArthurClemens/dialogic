export declare const MODE: {
    SHOW: string;
    HIDE: string;
};
export type TransitionStylesFn = (domElement: HTMLElement) => TransitionStyles;
export type TransitionStyles = {
    default?: Partial<CSSStyleDeclaration>;
    showStart?: Partial<CSSStyleDeclaration>;
    showEnd?: Partial<CSSStyleDeclaration>;
    hideStart?: Partial<CSSStyleDeclaration>;
    hideEnd?: Partial<CSSStyleDeclaration>;
};
type TransitionProps = {
    domElement?: HTMLElement;
    className?: string;
    styles?: TransitionStyles | TransitionStylesFn;
    __transitionTimeoutId__?: number;
};
export declare const transition: (props: TransitionProps, mode?: string) => Promise<unknown>;
export {};
