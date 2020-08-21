import React, { useState } from 'react';
import { CurrentPathBadge } from './CurrentPathBadge';
import { Route, Link, useRouteMatch, useHistory } from 'react-router-dom';
import {
  EditProfileDialog,
  TEditProfileDialogProps,
} from './EditProfileDialog';
import { notification, UseDialog, useDialog } from 'dialogic-react';
import { saveConfirmationProps, TSaveConfirmation } from './SaveConfirmation';

type TProps = {
  pathPrefix?: string;
  useDialogComponent?: boolean;
};

export const ProfilePage = ({
  pathPrefix = '',
  useDialogComponent,
}: TProps) => {
  // Test injecting a dynamic value into the dialog
  const [count, setCount] = useState(0);
  const match = useRouteMatch();
  const history = useHistory();
  const dialogPath = `${match.url}/edit`;
  const dialogReturnPath = match.url;
  const matchDialogPath = useRouteMatch(dialogPath);

  const useDialogProps = {
    dialogic: {
      component: EditProfileDialog,
      className: 'dialog',
    },
    pathPrefix,
    title: `Update your e-mail ${count}`,
    email: 'allan@company.com',
    onSave: (email: string) => {
      history.push(dialogReturnPath);
      notification.show<TSaveConfirmation>(saveConfirmationProps);
    },
    onCancel: () => {
      history.push(dialogReturnPath);
    },
    setCount,
  };

  useDialog<TEditProfileDialogProps>({
    isIgnore: useDialogComponent,
    isShow: matchDialogPath ? matchDialogPath.isExact : false,
    deps: [count],
    props: useDialogProps,
  });

  return (
    <div data-test-id="profile-page">
      <h1 className="title">Profile</h1>
      <CurrentPathBadge />
      <div className="buttons">
        <Link className="button" to={pathPrefix || '/'} data-test-id="btn-home">
          Go to Home
        </Link>
        <Link
          className="button is-link"
          to={dialogPath}
          data-test-id="btn-edit-profile"
        >
          Edit Profile
        </Link>
      </div>
      {useDialogComponent && (
        <Route path={dialogPath}>
          <UseDialog<TEditProfileDialogProps>
            isShow={matchDialogPath ? matchDialogPath.isExact : false}
            deps={[count]}
            props={useDialogProps}
          />
        </Route>
      )}
    </div>
  );
};
