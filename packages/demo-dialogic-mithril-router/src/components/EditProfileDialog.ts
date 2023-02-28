import m from 'mithril';

export type EditProfileDialogProps = {
  /**
   * Used for e2e tests.
   */
  pathPrefix: string;
  email: string;
  title: string;
  onCancel: () => void;
  onSave: (email: string) => void;
  increment: () => void;
};

export const EditProfileDialog: m.ClosureComponent<EditProfileDialogProps> = ({
  attrs: initialAttrs,
}) => ({
  view: ({ attrs }) =>
    m(
      'div',
      { className: 'modal is-active', 'data-test-id': 'edit-profile-dialog' },
      [
        m('div', { className: 'modal-background' }),
        m(
          'form',
          {
            className: 'modal-card',
            onsubmit: (e: Event) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const input: HTMLInputElement = form?.email;
              attrs.onSave(input.value);
            },
          },
          [
            m('header', { className: 'modal-card-head' }, [
              m(
                'p',
                { className: 'modal-card-title', 'data-test-id': 'title' },
                attrs.title,
              ),
              m('button', {
                type: 'button',
                className: 'delete',
                onclick: () => attrs.onCancel(),
                'data-test-id': 'btn-close',
              }),
            ]),
            m(
              'section',
              { className: 'modal-card-body' },
              m(
                'div',
                { className: 'field' },
                m('div', { className: 'control' }, [
                  m('input', {
                    className: 'input',
                    type: 'email',
                    name: 'email',
                    defaultValue: initialAttrs.email,
                    'data-test-id': 'input-email',
                  }),
                ]),
              ),
            ),
            m(
              'footer',
              { className: 'modal-card-foot' },
              m('footer-buttons', [
                m(
                  'button',
                  {
                    type: 'submit',
                    className: 'button is-link',
                    'data-test-id': 'btn-save',
                  },
                  'Save changes',
                ),
                m(
                  m.route.Link,
                  {
                    className: 'button is-link is-light is-outlined',
                    href: attrs.pathPrefix || '/',
                    'data-test-id': 'btn-home',
                  },
                  'Go to home',
                ),
                m(
                  'button',
                  {
                    type: 'button',
                    className: 'button is-link is-light is-outlined',
                    onclick: () => attrs.increment(),
                    'data-test-id': 'btn-add-count',
                  },
                  'Dynamic title count',
                ),
                m(
                  'button',
                  {
                    type: 'button',
                    className: 'button is-danger is-light',
                    onclick: () => attrs.onCancel(),
                    'data-test-id': 'btn-cancel',
                  },
                  'Cancel',
                ),
              ]),
            ),
          ],
        ),
      ],
    ),
});
