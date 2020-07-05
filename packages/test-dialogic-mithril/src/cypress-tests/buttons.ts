import m from 'mithril';
import { DialogicTests } from '../..';

type ButtonsProps = {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
  name?: string;
  id?: string;
  spawn?: string;
};

export const buttons = ({ showFn, hideFn, id, spawn, name }: ButtonsProps) => {
  const genName =
    name ||
    `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}` ||
    'default';
  return m('div', { className: 'buttons' }, [
    showFn &&
      m(
        'button',
        {
          className: 'button primary',
          onclick: showFn,
          'data-test-id': `button-show-${genName}`,
        },
        `Show ${genName}`,
      ),
    hideFn &&
      m(
        'button',
        {
          className: 'button',
          onclick: hideFn,
          'data-test-id': `button-hide-${genName}`,
        },
        `Hide ${genName}`,
      ),
  ]);
};
