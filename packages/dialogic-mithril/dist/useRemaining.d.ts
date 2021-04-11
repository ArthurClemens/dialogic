export declare const useRemaining: (props: {
  instance: {
    ns: string;
    defaultId: string;
    defaultSpawn: string;
    defaultDialogicOptions: import('dialogic/dist/types').DefaultDialogicOptions;
    show: <T = unknown>(
      options?: import('dialogic/dist/types').Options<T> | undefined,
    ) => Promise<import('dialogic/dist/types').Item<T>>;
    hide: <T_1 = unknown>(
      options?: import('dialogic/dist/types').Options<T_1> | undefined,
    ) => Promise<import('dialogic/dist/types').Item<T_1>>;
    hideAll: <T_2 = unknown>(
      dialogicOptions?:
        | import('dialogic/dist/types').DialogicOptions<T_2>
        | undefined,
    ) => Promise<import('dialogic/dist/types').Item<T_2>[]>;
    resetAll: (
      identityOptions?:
        | import('dialogic/dist/types').IdentityOptions
        | undefined,
    ) => Promise<import('dialogic/dist/types').Item<unknown>[]>;
    pause: <T_3 = unknown>(
      identityOptions?:
        | import('dialogic/dist/types').IdentityOptions
        | undefined,
    ) => Promise<import('dialogic/dist/types').Item<T_3>[]>;
    resume: <T_4 = unknown>(
      commandOptions?: import('dialogic/dist/types').CommandOptions | undefined,
    ) => Promise<import('dialogic/dist/types').Item<T_4>[]>;
    exists: (
      identityOptions?:
        | import('dialogic/dist/types').IdentityOptions
        | undefined,
    ) => boolean;
    getCount: (
      identityOptions?:
        | import('dialogic/dist/types').IdentityOptions
        | undefined,
    ) => number;
    isPaused: (
      identityOptions?:
        | import('dialogic/dist/types').IdentityOptions
        | undefined,
    ) => boolean;
    getRemaining: (
      identityOptions?:
        | import('dialogic/dist/types').IdentityOptions
        | undefined,
    ) => number | undefined;
  };
  id?: string | undefined;
  spawn?: string | undefined;
  roundToSeconds?: boolean | undefined;
}) => (number | undefined)[];
