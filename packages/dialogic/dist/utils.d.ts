export declare const isClient: boolean;
export declare const isServer: boolean;
declare type Fn = (args: any) => any;
export declare const pipe: (...fns: Fn[]) => (x: any) => any;
export declare const getStyleValue: ({ domElement, prop, }: {
    domElement: HTMLElement;
    prop: string;
}) => string | undefined;
export {};
