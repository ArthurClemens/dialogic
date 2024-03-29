/**
 * This example uses Material IO
 */

import { dialog } from 'dialogic-mithril';
import m, { Component } from 'mithril';

type DialogContentProps = {
  title: string;
  body: string;
  onAccept: () => void;
  onReject: () => void;
};

const DialogContent: Component<DialogContentProps> = {
  view: ({ attrs }) =>
    m(
      '.mdc-dialog__container',
      m('.mdc-dialog__surface', [
        m('h2.mdc-dialog__title', attrs.title),
        m('.mdc-dialog__content', attrs.body),
        m('footer.mdc-dialog__actions', [
          m(
            'button.mdc-button.mdc-dialog__button',
            {
              onclick: () => {
                dialog.hide();
                attrs.onReject();
              },
            },
            m('span.mdc-button__label', 'Resume'),
          ),
          m(
            'button.mdc-button.mdc-dialog__button',
            {
              onclick: () => {
                dialog.hide();
                attrs.onAccept();
              },
            },
            m('span.mdc-button__label', 'Hide all'),
          ),
        ]),
      ]),
    ),
};

export const DialogComponent: Component<DialogContentProps> = {
  view: ({ attrs }) =>
    m('.mdc-dialog.mdc-dialog--open', [
      m(DialogContent, { ...attrs }),
      m('.mdc-dialog__scrim'), // modal, onclick is not used
    ]),
};
