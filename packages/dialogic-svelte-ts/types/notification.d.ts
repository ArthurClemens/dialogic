import { Dialogic } from "dialogic";
export declare const notification: {
    getCount: (identityOptions?: Dialogic.IdentityOptions) => number;
    isPaused: (identityOptions?: Dialogic.IdentityOptions) => boolean;
    exists: (identityOptions?: Dialogic.IdentityOptions) => boolean;
    ns: string;
    defaultId: string;
    defaultSpawn: string;
    defaultDialogicOptions: Dialogic.DefaultDialogicOptions;
    show: <T = unknown>(options?: Dialogic.Options<T>) => Promise<Dialogic.Item<T>>;
    hide: <T_1 = unknown>(options?: Dialogic.Options<T_1>) => Promise<Dialogic.Item<T_1>>;
    hideAll: <T_2 = unknown>(dialogicOptions?: Dialogic.DialogicOptions<T_2>) => Promise<any[]>;
    resetAll: (identityOptions?: Dialogic.IdentityOptions) => Promise<Dialogic.Item<unknown>[]>;
    pause: <T_3 = unknown>(identityOptions?: Dialogic.IdentityOptions) => Promise<Dialogic.Item<T_3>[]>;
    resume: <T_4 = unknown>(commandOptions?: Dialogic.CommandOptions) => Promise<Dialogic.Item<T_4>[]>;
    getRemaining: (identityOptions?: Dialogic.IdentityOptions) => number;
};
