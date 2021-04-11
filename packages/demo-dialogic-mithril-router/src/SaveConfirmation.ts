import m, { Component } from 'mithril';

export type TSaveConfirmation = {
  content: string;
};
export const SaveConfirmation: Component<TSaveConfirmation> = {
  view: ({ attrs }) =>
    m(
      'div',
      { className: 'notification-content', 'data-test-id': 'notification' },
      attrs.content,
    ),
};

export const saveConfirmationProps = {
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
