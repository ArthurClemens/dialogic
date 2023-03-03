import 'dialogic';

import { getRandomId } from './utils';

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
}) => {
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
    instance.show({ ...props, title: `${title} ${getRandomId()}` });
  const hideFn = () =>
    instance.hide({ ...props, title: `${title} ${getRandomId()} hiding` });
  return {
    showFn,
    hideFn,
  };
};
// # sourceMappingURL=createFns.js.map
