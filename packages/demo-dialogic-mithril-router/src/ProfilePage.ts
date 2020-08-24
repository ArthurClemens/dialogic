import m from 'mithril';
import { CurrentPathBadge } from './CurrentPathBadge';
import { notification, useDialog } from 'dialogic-mithril';
import {
  TEditProfileDialogProps,
  EditProfileDialog,
} from './EditProfileDialog';
import { withHooks, useState } from 'mithril-hooks';
import { saveConfirmationProps, TSaveConfirmation } from './SaveConfirmation';

type TProps = {
  pathPrefix?: string;
};

const ProfilePageFn = (attrs: TProps) => {
  const pathPrefix = attrs.pathPrefix || '';
  // Test injecting a dynamic value into the dialog
  const [count, setCount] = useState(0);
  const dialogPath = `${pathPrefix}/profile/edit`;
  const returnPath = `${pathPrefix}/profile`;
  const isRouteMatch = m.route.get() === dialogPath;

  useDialog<TEditProfileDialogProps>({
    isShow: isRouteMatch,
    deps: [count],
    props: {
      dialogic: {
        component: EditProfileDialog,
        className: 'dialog',
      },
      pathPrefix,
      title: `Update your e-mail ${count}`,
      email: 'allan@company.com',
      onSave: (email: string) => {
        console.log('onSave:', email);
        m.route.set(returnPath);
        notification.show<TSaveConfirmation>(saveConfirmationProps);
      },
      onCancel: () => {
        console.log('onCancel');
        m.route.set(returnPath);
      },
      setCount,
    },
  });

  return m('div', { 'data-test-id': 'profile-page' }, [
    m('h1.title', 'Profile'),
    m(CurrentPathBadge),
    m('.buttons', [
      m(
        m.route.Link,
        {
          className: 'button',
          href: pathPrefix || '/',
          'data-test-id': 'btn-home',
        },
        'Go to home',
      ),
      m(
        m.route.Link,
        {
          className: 'button is-link',
          href: dialogPath,
          'data-test-id': 'btn-edit-profile',
        },
        'Edit profile',
      ),
    ]),
  ]);
};

export const ProfilePage: m.Component<TProps> = withHooks(ProfilePageFn);
