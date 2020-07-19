import m from 'mithril';

export type TEditProfileDialogProps = {
  email: string;
  title: string;
  onCancel: () => void;
  onSave: (email: string) => void;
};

export const EditProfileDialog: m.ClosureComponent<TEditProfileDialogProps> = () => {
  const localState = {
    email: '',
  };
  const setEmail = (newEmail: string) => {
    localState.email = newEmail;
  };
  return {
    view: ({ attrs }) => {
      return m('div', { className: 'modal is-active' }, [
        m('div', { className: 'modal-background' }),
        m('div', { className: 'modal-card' }, [
          m('header', { className: 'modal-card-head' }, [
            m('p', { className: 'modal-card-title' }, attrs.title),
            m('button', {
              className: 'delete',
              onclick: () => attrs.onCancel(),
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
                  defaultvalue: attrs.email,
                  oninput: (e: InputEvent) => {
                    if (e.target) {
                      setEmail((e.target as HTMLInputElement).value);
                    }
                  },
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
              },
              'Save changes',
            ),
            m(
              'button',
              {
                className: 'button is-danger is-light',
                onclick: () => attrs.onCancel(),
              },
              'Cancel',
            ),
            m(m.route.Link, { className: 'button', href: '/' }, 'Go to home'),
          ]),
        ]),
      ]);
    },
  };
};
