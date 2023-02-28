import { notification, UseDialog, useDialog } from 'dialogic-react';
import React from 'react';
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';

import { CurrentPathBadge } from '../components/CurrentPathBadge';
import {
  EditProfileDialog,
  EditProfileDialogProps,
} from '../components/EditProfileDialog';
import {
  saveConfirmationData,
  SaveConfirmationProps,
} from '../components/SaveConfirmation';
import { TStore } from '../store';

function useGetEditProfileDialogProps({
  store,
  dialogFragment,
  pathPrefix,
}: {
  store: TStore;
  dialogFragment?: string;
  pathPrefix?: string;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const url = useResolvedPath('').pathname;
  const dialogPath = `${url}/${dialogFragment}`;
  const dialogReturnPath = url;
  const isExactMatch = location.pathname === dialogPath;

  const dialogProps = {
    dialogic: {
      component: EditProfileDialog,
      className: 'demo-dialog',
    },
    pathPrefix,
    title: `Update your e-mail ${store.count}`,
    email: store.email,
    onSave: (newEmail: string) => {
      if (newEmail !== store.email) {
        store.setEmail(newEmail);
        notification.show<SaveConfirmationProps>(saveConfirmationData);
      }
      navigate(dialogReturnPath);
    },
    onCancel: () => {
      navigate(dialogReturnPath); // we could also pass dialogReturnPath to the dialog to use it as Link `to`
    },
    increment: store.increment,
  };

  return {
    dialogPath,
    isExactMatch,
    dialogProps,
  };
}

type ProfilePageProps = {
  /**
   * Used for e2e tests.
   */
  pathPrefix?: string;
  useDialogComponent?: boolean;
  store: TStore;
  profileDialogProps: ReturnType<typeof useGetEditProfileDialogProps>;
};

function ProfilePage({
  pathPrefix = '',
  useDialogComponent,
  store,
  profileDialogProps,
}: ProfilePageProps) {
  const { isExactMatch, dialogProps, dialogPath } = profileDialogProps;

  // The useDialog function would normally be used when not using React Router
  useDialog<EditProfileDialogProps>({
    isIgnore: useDialogComponent,
    isShow: !!isExactMatch,
    deps: [store.count], // update the dialog contents whenever count changes
    props: dialogProps,
  });

  return (
    <>
      <div data-test-id='profile-page'>
        <h1 className='title'>Profile</h1>
        <CurrentPathBadge />
        <div className='profile-tile'>
          <div>
            <strong>Email</strong>
          </div>
          <div data-test-id='current-email'>{store.email}</div>
          <Link
            className='button is-link'
            to={dialogPath}
            data-test-id='btn-edit-profile'
          >
            Edit
          </Link>
        </div>

        <div className='buttons'>
          <Link
            className='button is-link is-light is-outlined'
            to={pathPrefix || '/'}
            data-test-id='btn-home'
          >
            Go to Home
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
}

type Props = {
  /**
   * Used for e2e tests.
   */
  pathPrefix?: string;
  useDialogComponent?: boolean;
  store: TStore;
};

export function ProfileRoutes({
  pathPrefix = '',
  useDialogComponent,
  store,
}: Props) {
  const dialogFragment = 'edit';
  const profileDialogProps = useGetEditProfileDialogProps({
    pathPrefix,
    store,
    dialogFragment,
  });
  const { isExactMatch, dialogProps } = profileDialogProps;

  return (
    <Routes>
      <Route
        path='*'
        element={
          <ProfilePage
            store={store}
            pathPrefix={pathPrefix}
            useDialogComponent={useDialogComponent}
            profileDialogProps={profileDialogProps}
          />
        }
      >
        {/* When using React Router, adding UseDialog component is the typical use (instead of the useDialog function) */}
        {useDialogComponent && (
          <Route
            path={dialogFragment}
            element={
              <UseDialog<EditProfileDialogProps>
                isShow={!!isExactMatch}
                deps={[store.count]}
                props={dialogProps}
              />
            }
          />
        )}
      </Route>
    </Routes>
  );
}
