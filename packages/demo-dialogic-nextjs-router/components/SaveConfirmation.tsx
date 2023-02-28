import React from 'react';

export type SaveConfirmationProps = {
  content: string;
};

export function SaveConfirmation(props: SaveConfirmationProps) {
  return (
    <div className='notification-content' data-test-id='notification'>
      {props.content}
    </div>
  );
}

export const saveConfirmationData = {
  dialogic: {
    component: SaveConfirmation,
    className: 'demo-notification',
    styles: (domElement: HTMLElement) => {
      const { height } = domElement.getBoundingClientRect();

      return {
        default: {
          transition: 'all 350ms ease-in-out',
        },
        showStart: {
          transform: `translate3d(0, ${height}px, 0)`,
        },
        showEnd: {
          transform: 'translate3d(0, 0px,  0)',
          transitionDelay: '500ms',
        },
        hideEnd: {
          transitionDuration: '450ms',
          transform: `translate3d(0, ${height}px, 0)`,
        },
      };
    },
  },
  content: 'E-mail address updated',
};
