import m from 'mithril';
import Stream from 'mithril/stream';
import { CurrentPathBadge } from './CurrentPathBadge';
import { dialog, Dialogic } from 'dialogic-mithril';
import { EditProfileDialogProps, EditProfileDialog } from './EditProfileDialog';

export type UseDialogicProps<T> = {
  /**
   * Condition when the instance should be shown.
   */
  isShow?: boolean;
  $isShow?: Stream<boolean>;

  /**
   * For directed use only. Condition when the instance should be hidden.
   */
  isHide?: boolean;

  /**
   * Props to pass to the instance.
   */
  props?: Dialogic.Options<T>;

  /**
   * Function called just before instance.show() is called. This moment could be used to store the current scroll position.
   */
  beforeShow?: () => void;

  /**
   * Function called just before instance.hide() is called. This moment could be used to restore the scroll position.
   */
  beforeHide?: () => void;
};

type UseDialogicInstanceProps<T> = UseDialogicProps<T> & {
  /**
   * Instance to show.
   */
  instance: Dialogic.DialogicInstance;
};

// let useDialogicCounter = 0;

const useDialogic = <T>(allProps: UseDialogicInstanceProps<T>) => {
  const { instance, $isShow, props = {} as T & Dialogic.Options<T> } = allProps;
  // const id = useDialogicCounter++;
  // console.log('id', id);
  // console.log('useDialogic; allProps', allProps);

  // const props = {
  //   ...props,
  //   ...(props.dialogic
  //     ? {
  //         dialogic: {
  //           ...props.dialogic,
  //           id: props.dialogic.id || id,
  //         },
  //       }
  //     : {
  //         dialogic: {
  //           id,
  //         },
  //       }),
  // };

  const showInstance = () => {
    // beforeShow();
    console.log('showInstance props', props);
    instance.show<T>(props);
    // m.redraw();
  };

  const hideInstance = () => {
    // beforeHide();
    console.log('hideInstance props', props, 'instance.hide', instance.hide);
    instance.hide<T>(props);
    // m.redraw();
  };

  const update = () => {
    console.log('update');
    if ($isShow !== undefined) {
      if ($isShow()) {
        showInstance();
      } else {
        hideInstance();
      }
    }
  };
  if ($isShow) {
    $isShow.map(update);
  }
};

const useDialog = <T>(props: UseDialogicProps<T>) =>
  useDialogic<T>({ ...props, instance: dialog });

export const ProfilePage = () => {
  const dialogPath = '/profile/edit';
  const returnPath = '/profile';
  const $isShow = Stream(false);

  useDialog<EditProfileDialogProps>({
    $isShow,
    props: {
      dialogic: {
        component: EditProfileDialog,
        className: 'dialog',
        queued: true,
        id: 'edit-profile',
        didHide: () => {
          console.log('didHide');
          // m.route.set(returnPath);
          m.redraw();
          return;
        },
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

  return {
    onupdate: () => {
      console.log('ProfilePage onupdate');
      $isShow(m.route.get() === dialogPath);
      console.log('$isShow', $isShow());
    },
    onbeforeremove: () => {
      console.log('ProfilePage onbeforeremove');
      $isShow(m.route.get() === dialogPath);
      console.log('$isShow', $isShow());
      return new Promise((accept, reject) => {
        setTimeout(() => {
          accept();
        }, 1000);
      });
    },
    onremove: () => {
      console.log('ProfilePage onremove');
      $isShow(m.route.get() === dialogPath);
      console.log('$isShow', $isShow());
    },
    view: () => {
      console.log('ProfilePage view');

      $isShow(m.route.get() === dialogPath);
      console.log('$isShow', $isShow());

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
    },
  };
};
