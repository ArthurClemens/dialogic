import React, { useState } from 'react';
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
  // UseDialog,
  useDialog,
} from 'dialogic-react';
import { saveConfirmationProps, TSaveConfirmation } from './SaveConfirmation';

type TProps = {
  pathPrefix?: string;
};

export const ProfilePage = ({ pathPrefix = '' }: TProps) => {
  const [count, setCount] = useState(0);
  const match = useRouteMatch();
  const history = useHistory();
  const dialogPath = `${match.url}/edit`;
  const dialogReturnPath = match.url;
  const matchDialogPath = useRouteMatch(dialogPath);

  useDialog<EditProfileDialogProps>({
    isShow: matchDialogPath ? matchDialogPath.isExact : false,
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
        history.push(dialogReturnPath);
        notification.show<TSaveConfirmation>(saveConfirmationProps);
      },
      onCancel: () => {
        console.log('onCancel');
        history.push(dialogReturnPath);
      },
      setCount,
    },
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
      {/* <Route path={dialogPath}>
        <UseDialog<EditProfileDialogProps>
          isShow={matchDialogPath ? matchDialogPath.isExact : false}
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
              notification.show<TSaveConfirmation>(saveConfirmationProps);
            },
            onCancel: () => {
              console.log('onCancel');
              history.push(dialogReturnPath);
            },
          }}
        />
      </Route> */}
    </div>
  );
};
