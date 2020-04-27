import React from 'react';
import { CurrentPathBadge } from './CurrentPathBadge';
import { Route, Link, useRouteMatch, useHistory } from 'react-router-dom';
import { EditProfileDialog, EditProfileDialogProps } from './EditProfileDialog';
import { notification, MakeAppearDialog } from 'dialogic-react';
import { saveConfirmationProps } from './SaveConfirmation';

export const ProfilePage = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const dialogUrl = `${match.url}/edit`;
  const dialogReturnUrl = match.url;
  return (
    <>
      <h1 className="title">Profile</h1>
      <CurrentPathBadge />
      <div className="buttons">
        <Link className="button" to="/">
          Go to home
        </Link>
        <Link className="button is-link" to={dialogUrl}>
          Edit profile
        </Link>
      </div>
      <Route path={dialogUrl}>
        <MakeAppearDialog<EditProfileDialogProps>
          dialogic={{
            component: EditProfileDialog,
            className: 'dialog',
          }}
          title="Update your e-mail"
          email="allan@company.com"
          onSave={email => {
            console.log('onSave:', email);
            history.push(dialogReturnUrl);
            notification.show(saveConfirmationProps);
          }}
          onCancel={() => {
            console.log('onCancel');
            history.push(dialogReturnUrl);
          }}
        />
      </Route>
    </>
  );
};
