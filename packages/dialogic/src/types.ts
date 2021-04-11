import Stream from 'mithril/stream';

import { dialogical } from './dialogical';
import type { Timer } from './state/timer';
import { TransitionStyles, TransitionStylesFn } from './transition';

export type { TransitionStyles, TransitionStylesFn };

export type DialogicInstance = ReturnType<typeof dialogical>;

type ConfirmFn<T = unknown> = {
  (item: Item<T>): void;
};

export type DefaultDialogicOptions = {
  id: string;
  spawn: string;
  queued?: boolean;
  timeout?: number;
};

export type IdentityOptions = {
  id?: string;
  spawn?: string;
};

export type ComponentOptions = {
  onMount?: (args?: unknown) => unknown;
} & IdentityOptions;

export type TimerResumeOptions = {
  minimumDuration?: number;
};

export type CommandOptions = IdentityOptions & TimerResumeOptions;

// Components

export type PassThroughOptions = unknown;

export type DialogicalWrapperOptions = {
  ns: string;
  identityOptions: IdentityOptions;
};

export type DialogicalInstanceDispatchFn = (event: InstanceEvent) => void;

export type DialogicalInstanceOptions<T = unknown> = {
  identityOptions: IdentityOptions;
  dialogicOptions: DialogicOptions<T>;
  passThroughOptions?: T;
  onMount: DialogicalInstanceDispatchFn;
  onShow: DialogicalInstanceDispatchFn;
  onHide: DialogicalInstanceDispatchFn;
};

export type DialogicOptions<T = unknown> = {
  className?: string;
  component?: unknown;
  willHide?: ConfirmFn<T>;
  didHide?: ConfirmFn<T>;
  willShow?: ConfirmFn<T>;
  didShow?: ConfirmFn<T>;
  domElement?: HTMLElement;
  queued?: boolean;
  styles?: TransitionStyles | TransitionStylesFn;
  timeout?: number;
  toggle?: boolean;
} & IdentityOptions & {
    __transitionTimeoutId__?: number;
  };

export type Options<T = unknown> = {
  dialogic?: DialogicOptions<T>;
} & T;

export type MaybeItem<T = unknown> = {
  just?: Item<T>;
  nothing?: undefined;
};

export type Callbacks<T = unknown> = {
  willHide: ConfirmFn<T>;
  willShow: ConfirmFn<T>;
  didHide: ConfirmFn<T>;
  didShow: ConfirmFn<T>;
};

/**
 * An Item is a dialog or notification, or a custom object created with `dialogical`.
 */
export type Item<T = unknown> = {
  ns: string;
  id: string;
  passThroughOptions: T;
  key: string;
  identityOptions: IdentityOptions;
  timer?: Timer;
  dialogicOptions: DialogicOptions<T>;
  transitionState: number;
  callbacks: Callbacks<T>;
};

export type NamespaceStore = {
  [key: string]: Item<unknown>[];
};

export type State = {
  store: NamespaceStore;
};

export type States = Stream<State>;

export type InstanceEvent = {
  detail: {
    identityOptions: IdentityOptions;
    domElement: HTMLElement;
  };
};

export type InitiateItemTransitionFn = <T = unknown>(
  item: Item<T>,
) => Promise<Item<T>>;
