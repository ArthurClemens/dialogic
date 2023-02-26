import { Dialog, dialog } from 'dialogic-react';
import React from 'react';

import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
import { createFns } from './helpers/createFns';

export default function DialogStyles() {
  const fns1 = createFns({
    instance: dialog,
    component: Default,
    title: 'DialogStyles',
    styles: (domElement: HTMLElement) => {
      const { height } = domElement.getBoundingClientRect();
      return {
        default: {
          transition: 'all 350ms ease-in-out',
        },
        showStart: {
          opacity: '0',
          transform: `translate3d(0, ${height}px, 0)`,
        },
        showEnd: {
          opacity: '1',
          transform: 'translate3d(0, 0px,  0)',
        },
        hideEnd: {
          transitionDuration: '450ms',
          transform: `translate3d(0, ${height}px, 0)`,
          opacity: '0',
        },
      };
    },
  });
  const fns2 = createFns({
    instance: dialog,
    component: Default,
    title: 'DialogStyles',
    className: 'dialog',
    styles: (domElement: HTMLElement) => {
      const { height } = domElement.getBoundingClientRect();
      return {
        default: {
          transition: 'all 350ms ease-in-out',
        },
        hideEnd: {
          transitionDuration: '450ms',
          transform: `translate3d(0, ${height}px, 0)`,
          opacity: '0',
        },
      };
    },
  });

  return (
    <div className='test'>
      <Buttons {...fns1} />
      <Buttons {...fns2} name='combi' />
      <div className='spawn default-spawn'>
        <Dialog />
      </div>
    </div>
  );
}
