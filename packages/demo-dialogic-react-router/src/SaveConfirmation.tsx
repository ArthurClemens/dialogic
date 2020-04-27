import React from 'react';

export const SaveConfirmation = () => (
  <div className="notification-content">E-mail address saved</div>
);

export const saveConfirmationProps = {
  dialogic: {
    component: SaveConfirmation,
    className: 'demo-notification',
    styles: (domElement: HTMLElement) => {
      const height = domElement.getBoundingClientRect().height;

      return {
        default: {
          transition: 'all 300ms ease-in-out',
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
};
