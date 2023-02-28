import { Dialogic } from 'dialogic';
import m from 'mithril';

import { getRandomId } from './utils';

type ItemProps = {
  title: string;
  className: string;
  id: string;
  contentId: string;
};

type Props<T> = {
  instance: Dialogic.DialogicInstance;
  component: m.Component<T>;
  className?: string;
  id?: string;
  spawn?: string;
  title: string;
  styles?: Dialogic.TransitionStyles | Dialogic.TransitionStylesFn;
  timeout?: number;
  queued?: boolean;
};

export const createFns = <T>({
  instance,
  component,
  className,
  title,
  id,
  spawn,
  styles,
  timeout,
  queued,
}: Props<T>) => {
  const contentId = `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}`;
  const props = {
    dialogic: {
      component,
      className,
      styles,
      id,
      spawn,
      ...(spawn !== undefined ? { spawn } : undefined),
      ...(timeout !== undefined ? { timeout } : undefined),
      ...(queued !== undefined ? { queued } : undefined),
    },
    className: 'instance-content',
    id: getRandomId(),
    contentId,
  };

  const showFn = () =>
    instance.show<ItemProps>({
      ...props,
      title: `${title} ${getRandomId()}`,
    });
  const hideFn = () =>
    instance.hide<ItemProps>({
      ...props,
      title: `${title} ${getRandomId()} hiding`,
    });

  return {
    showFn,
    hideFn,
  };
};
