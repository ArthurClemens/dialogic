import { Dialog, dialog } from 'dialogic-mithril';
import m from 'mithril';

const DialogContent = {
  view: () =>
    m(
      '.mdc-dialog__container',
      m('.mdc-dialog__surface', [
        m('h2.mdc-dialog__title', 'Dialog Title'),
        m('.mdc-dialog__content', 'Dialog body text goes here.'),
        m('footer.mdc-dialog__actions', [
          m(
            'button.mdc-button.mdc-dialog__button',
            m(
              'span.mdc-button__label',
              {
                onclick: () => dialog.hide(),
              },
              'No',
            ),
          ),
          m(
            'button.mdc-button.mdc-dialog__button',
            m(
              'span.mdc-button__label',
              {
                onclick: () => dialog.hide(),
              },
              'Yes',
            ),
          ),
        ]),
      ]),
    ),
};

const MaterialIODialogComponent = (isModal: boolean = false) => ({
  view: () =>
    m('.mdc-dialog.mdc-dialog--open', [
      m(DialogContent),
      m('.mdc-dialog__scrim', {
        onclick: () => !isModal && dialog.hide(),
      }),
    ]),
});

export default {
  view: () =>
    m('.test', [
      m('.buttons', [
        m(
          '.button',
          {
            onclick: () => {
              dialog.show({
                dialogic: {
                  component: MaterialIODialogComponent(),
                  className: 'dialog',
                },
              });
            },
          },
          'Show dialog',
        ),
        m(
          '.button',
          {
            onclick: () => {
              dialog.show({
                dialogic: {
                  component: MaterialIODialogComponent(true),
                  className: 'dialog',
                },
              });
            },
          },
          'Show modal dialog',
        ),
      ]),
      m('.materialIO', m(Dialog)),
    ]),
};
