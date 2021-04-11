import { Dialogic } from './index';

export declare const dialogical: ({
  ns,
  queued,
  timeout,
}: {
  ns: string;
  queued?: boolean | undefined;
  timeout?: number | undefined;
}) => {
  ns: string;
  defaultId: string;
  defaultSpawn: string;
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions;
  show: <T = unknown>(
    options?: Dialogic.Options<T> | undefined,
  ) => Promise<Dialogic.Item<T>>;
  hide: <T_1 = unknown>(
    options?: Dialogic.Options<T_1> | undefined,
  ) => Promise<Dialogic.Item<T_1>>;
  hideAll: <T_2 = unknown>(
    dialogicOptions?: Dialogic.DialogicOptions<T_2> | undefined,
  ) => Promise<Dialogic.Item<T_2>[]>;
  resetAll: (
    identityOptions?: Dialogic.IdentityOptions | undefined,
  ) => Promise<Dialogic.Item<unknown>[]>;
  pause: <T_3 = unknown>(
    identityOptions?: Dialogic.IdentityOptions | undefined,
  ) => Promise<Dialogic.Item<T_3>[]>;
  resume: <T_4 = unknown>(
    commandOptions?: Dialogic.CommandOptions | undefined,
  ) => Promise<Dialogic.Item<T_4>[]>;
  exists: (identityOptions?: Dialogic.IdentityOptions | undefined) => boolean;
  getCount: (identityOptions?: Dialogic.IdentityOptions | undefined) => number;
  isPaused: (identityOptions?: Dialogic.IdentityOptions | undefined) => boolean;
  getRemaining: (
    identityOptions?: Dialogic.IdentityOptions | undefined,
  ) => number | undefined;
};
