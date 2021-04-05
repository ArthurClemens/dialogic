export declare const isClient: boolean;
export declare const isServer: boolean;
declare type Fn = (args: unknown) => unknown;
export declare const pipe: (...fns: Fn[]) => (x: unknown) => unknown;
export declare const getStyleValue: ({
  domElement,
  prop,
}: {
  domElement: HTMLElement;
  prop: string;
}) => string | undefined;
export {};
