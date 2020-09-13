import m from 'mithril';
import { CurrentPathBadge } from './CurrentPathBadge';
import { notification, useDialog } from 'dialogic-mithril';
import {
  TEditProfileDialogProps,
  EditProfileDialog,
} from './EditProfileDialog';
import { withHooks } from 'mithril-hooks';
import { saveConfirmationProps, TSaveConfirmation } from './SaveConfirmation';
import { store } from './store';

type TProps = {
  pathPrefix?: string;
};

const ProfilePageFn = (attrs: TProps) => {
  const pathPrefix = attrs.pathPrefix || '';
  // Test injecting a dynamic value into the dialog
  const dialogPath = `${pathPrefix}/profile/edit`;
  const returnPath = `${pathPrefix}/profile`;
  const isRouteMatch = m.route.get() === dialogPath;

  console.log('store', store);

  useDialog<TEditProfileDialogProps>({
    isShow: isRouteMatch,
    deps: [store.count], // update the dialog contents whenever count changes
    props: {
      dialogic: {
        component: EditProfileDialog,
        className: 'dialog',
      },
      pathPrefix,
      title: `Update your e-mail ${store.count}`,
      email: store.email,
      onSave: (newEmail: string) => {
        if (newEmail !== store.email) {
          store.setEmail(newEmail);
          notification.show<TSaveConfirmation>(saveConfirmationProps);
        }
        m.route.set(returnPath);
      },
      onCancel: () => {
        console.log('onCancel');
        m.route.set(returnPath);
      },
      increment: store.increment,
    },
  });

  return m('div', { 'data-test-id': 'profile-page' }, [
    m('h1.title', 'Profile'),
    m(CurrentPathBadge),
    m('div.profile-tile', [
      m('div', m('strong', 'Email')),
      m('div', { 'data-test-id': 'current-email' }, store.email),
      m(
        m.route.Link,
        {
          className: 'button is-link',
          href: dialogPath,
          'data-test-id': 'btn-edit-profile',
        },
        'Edit',
      ),
    ]),
    m('.buttons', [
      m(
        m.route.Link,
        {
          className: 'button is-link is-light is-outlined',
          href: pathPrefix || '/',
          'data-test-id': 'btn-home',
        },
        'Go to home',
      ),
    ]),
  ]);
};

export const ProfilePage: m.Component<TProps> = withHooks(ProfilePageFn);
