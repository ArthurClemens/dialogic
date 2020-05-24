import React from 'react';
import { CurrentPathBadge } from './CurrentPathBadge';
import {
  // Route,
  Link,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import { EditProfileDialog, EditProfileDialogProps } from './EditProfileDialog';
import {
  notification,
  // MakeAppearDialog,
  useMakeAppearDialog,
} from 'dialogic-react';
import { saveConfirmationProps } from './SaveConfirmation';

export const ProfilePage = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const dialogPath = `${match.url}/edit`;
  const dialogReturnPath = match.url;

  useMakeAppearDialog<EditProfileDialogProps>({
    pathname: dialogPath,
    locationPathname: history.location.pathname, // required when using hash router
    props: {
      dialogic: {
        component: EditProfileDialog,
        className: 'dialog',
      },
      title: 'Update your e-mail',
      email: 'allan@company.com',
      onSave: (email: string) => {
        console.log('onSave:', email);
        history.push(dialogReturnPath);
        notification.show(saveConfirmationProps);
      },
      onCancel: () => {
        console.log('onCancel');
        history.push(dialogReturnPath);
      },
    },
  });

  return (
    <>
      <h1 className="title">Profile</h1>
      <CurrentPathBadge />
      <div className="buttons">
        <Link className="button" to="/">
          Go to home
        </Link>
        <Link className="button is-link" to={dialogPath}>
          Edit profile
        </Link>
      </div>
      {/* <Route path={dialogPath}>
        <MakeAppearDialog<EditProfileDialogProps>
          pathname={dialogPath}
          locationPathname={history.location.pathname}
          beforeHide={() => console.log('before hide')}
          props={{
            dialogic: {
              component: EditProfileDialog,
              className: 'dialog',
            },
            title: 'Update your e-mail',
            email: 'allan@company.com',
            onSave: (email: string) => {
              console.log('onSave:', email);
              history.push(dialogReturnPath);
              notification.show(saveConfirmationProps);
            },
            onCancel: () => {
              console.log('onCancel');
              history.push(dialogReturnPath);
            },
          }}
        />
      </Route> */}
    </>
  );
};
