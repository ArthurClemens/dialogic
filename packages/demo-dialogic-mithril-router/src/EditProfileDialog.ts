import m from 'mithril';
import { MithrilHooks } from 'mithril-hooks';

export type TEditProfileDialogProps = {
  pathPrefix: string;
  email: string;
  title: string;
  onCancel: () => void;
  onSave: (email: string) => void;
  setCount: (value: MithrilHooks.ValueOrFn<number>) => void;
};

export const EditProfileDialog: m.ClosureComponent<TEditProfileDialogProps> = ({
  attrs: initialAttrs,
}) => {
  const localState = {
    email: initialAttrs.email,
  };
  const setEmail = (newEmail: string) => {
    localState.email = newEmail;
  };
  return {
    view: ({ attrs }) => {
      return m(
        'div',
        { className: 'modal is-active', 'data-test-id': 'edit-profile-dialog' },
        [
          m('div', { className: 'modal-background' }),
          m('div', { className: 'modal-card' }, [
            m('header', { className: 'modal-card-head' }, [
              m(
                'p',
                { className: 'modal-card-title', 'data-test-id': 'title' },
                attrs.title,
              ),
              m('button', {
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
                    value: localState.email,
                    oninput: (e: InputEvent) => {
                      if (e.target) {
                        setEmail((e.target as HTMLInputElement).value);
                      }
                    },
                    'data-test-id': 'input-email',
                  }),
                ]),
              ),
            ),
            m('footer', { className: 'modal-card-foot' }, [
              m(
                'button',
                {
                  className: 'button is-link',
                  onclick: () => attrs.onSave(localState.email),
                  'data-test-id': 'btn-save',
                },
                'Save changes',
              ),
              m(
                'button',
                {
                  className: 'button is-danger is-light',
                  onclick: () => attrs.onCancel(),
                  'data-test-id': 'btn-cancel',
                },
                'Cancel',
              ),
              m(
                m.route.Link,
                {
                  className: 'button',
                  href: attrs.pathPrefix || '/',
                  'data-test-id': 'btn-home',
                },
                'Go to home',
              ),
              m(
                'button',
                {
                  className: 'button',
                  onclick: () => attrs.setCount(current => current + 1),
                  'data-test-id': 'btn-add-count',
                },
                'Increment count',
              ),
            ]),
          ]),
        ],
      );
    },
  };
};
