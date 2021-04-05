export declare const dialog: {
  ns: string;
  defaultId: string;
  defaultSpawn: string;
  defaultDialogicOptions: import('./types').DefaultDialogicOptions;
  show: <T = unknown>(
    options?: import('./types').Options<T>,
  ) => Promise<import('./types').Item<T>>;
  hide: <T_1 = unknown>(
    options?: import('./types').Options<T_1> | undefined,
  ) => Promise<import('./types').Item<T_1>>;
  hideAll: <T_2 = unknown>(
    dialogicOptions?: import('./types').DialogicOptions<T_2> | undefined,
  ) => Promise<import('./types').Item<T_2>[]>;
  resetAll: (
    identityOptions?: import('./types').IdentityOptions | undefined,
  ) => Promise<import('./types').Item<unknown>[]>;
  pause: <T_3 = unknown>(
    identityOptions?: import('./types').IdentityOptions | undefined,
  ) => Promise<import('./types').Item<T_3>[]>;
  resume: <T_4 = unknown>(
    commandOptions?: import('./types').CommandOptions | undefined,
  ) => Promise<import('./types').Item<T_4>[]>;
  exists: (
    identityOptions?: import('./types').IdentityOptions | undefined,
  ) => boolean;
  getCount: (
    identityOptions?: import('./types').IdentityOptions | undefined,
  ) => number;
  isPaused: (identityOptions: import('./types').IdentityOptions) => boolean;
  getRemaining: (
    identityOptions: import('./types').IdentityOptions,
  ) => number | undefined;
};
