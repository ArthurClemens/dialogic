import { Dialogic } from './index';

export declare const MODE: {
  SHOW: string;
  HIDE: string;
};
declare type TransitionProps = {
  domElement?: HTMLElement;
  className?: string;
  styles?: Dialogic.TransitionStyles | Dialogic.TransitionStylesFn;
  __transitionTimeoutId__?: number;
};
export declare const transition: (
  props: TransitionProps,
  mode?: string | undefined,
) => Promise<unknown>;
export {};
