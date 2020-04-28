import { FunctionComponent, PropsWithChildren } from 'react';
import { dialog, notification, Dialogic } from 'dialogic';

export { dialog, notification };

interface Dialog extends Dialogic.ComponentOptions {}
export const Dialog: FunctionComponent<Dialogic.ComponentOptions>;

interface Notification extends Dialogic.ComponentOptions {}
export const Notification: FunctionComponent<Dialogic.ComponentOptions>;

export const useDialogicState: UseDialogicState;
export const useRemaining: UseRemaining;

export type MakeAppearProps<T> = {
  instance: Dialogic.DialogicInstance;
  appearPath?: string;
} & Dialogic.Options &
  T;

export const MakeAppear: <T>(
  props: PropsWithChildren<MakeAppearProps<T>>,
) => null;

export type MakeAppearInstanceProps<T> = Dialogic.Options & T;

export const MakeAppearDialog: <T>(
  props: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => null;

export const MakeAppearNotification: <T>(
  props: PropsWithChildren<MakeAppearInstanceProps<T>>,
) => null;

export type UseDialogicState = () => void;
export type UseRemaining = ({
  instance,
  roundToSeconds,
}: {
  instance: Dialogic.DialogicInstance;
  roundToSeconds: boolean;
}) => [number | undefined];
