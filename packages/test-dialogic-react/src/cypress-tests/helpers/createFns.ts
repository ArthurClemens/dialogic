import { Dialogic } from 'dialogic';
import { getRandomId } from '../utils';

type CreateFnsProps = {
  instance: Dialogic.DialogicInstance;
  component: any;
  className?: string;
  id?: string;
  spawn?: string;
  title: string;
  styles?: any;
  timeout?: number;
  queued?: boolean;
};

export type TInstance = {
  title: string;
};

export const createFns = ({
  instance,
  component,
  className,
  title,
  id,
  spawn,
  styles,
  timeout,
  queued,
}: CreateFnsProps) => {
  const contentId = `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}`;
  const props = {
    dialogic: {
      component: component,
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
    instance.show<TInstance>({
      ...props,
      title: `${title} ${getRandomId()}`,
    });
  const hideFn = () =>
    instance.hide<TInstance>({
      ...props,
      title: `${title} ${getRandomId()} hiding`,
    });

  return {
    showFn,
    hideFn,
  };
};
