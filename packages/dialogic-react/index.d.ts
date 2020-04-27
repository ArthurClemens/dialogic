import { FunctionComponent, PropsWithChildren } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';
import { UseDialogicState } from './src/useDialogicState';
import { UseRemaining } from './src/useRemaining';

export { dialog, notification };

interface Dialog extends Dialogic.ComponentOptions {}
export const Dialog: FunctionComponent<Dialogic.ComponentOptions>;

interface Notification extends Dialogic.ComponentOptions {}
export const Notification: FunctionComponent<Dialogic.ComponentOptions>;

export const useDialogicState: UseDialogicState;
export const useRemaining: UseRemaining;

type MakeAppearProps<T> = Dialogic.Options & T;

export const MakeAppear: <T>(
  props: PropsWithChildren<MakeAppearProps<T>>,
) => null;

type MakeAppearInstanceProps<T> = Dialogic.Options & T;

export const MakeAppearDialog: <T>(
  props: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => null;

export const MakeAppearNotification: <T>(
  props: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => null;
