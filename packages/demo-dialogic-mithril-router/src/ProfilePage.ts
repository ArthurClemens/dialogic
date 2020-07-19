import m from 'mithril';
import { CurrentPathBadge } from './CurrentPathBadge';
import { dialog } from 'dialogic-mithril';
import {
  TEditProfileDialogProps,
  EditProfileDialog,
} from './EditProfileDialog';
import { useDialog } from './useDialogic';
import { withHooks } from 'mithril-hooks';

const ProfilePageFn = () => {
  const dialogPath = '/profile/edit';
  const returnPath = '/profile';
  const isRouteMatch = m.route.get() === dialogPath;

  useDialog<TEditProfileDialogProps>({
    isShow: isRouteMatch,
    instance: dialog,
    props: {
      dialogic: {
        component: EditProfileDialog,
        className: 'dialog',
      },
      title: 'Update your e-mail',
      email: 'allan@company.com',
      onSave: (email: string) => {
        console.log('onSave:', email);
        m.route.set(returnPath);
        // notification.show<TSaveConfirmation>(saveConfirmationProps);
      },
      onCancel: () => {
        console.log('onCancel');
        m.route.set(returnPath);
        // dialog.hide();
      },
    },
  });

  return m('div', [
    m('h1.title', 'Profile'),
    m(CurrentPathBadge),
    m('.buttons', [
      m(m.route.Link, { className: 'button', href: '/' }, 'Go to home'),
      m(
        m.route.Link,
        { className: 'button is-link', href: dialogPath },
        'Edit profile',
      ),
    ]),
  ]);
};

export const ProfilePage = withHooks(ProfilePageFn);
