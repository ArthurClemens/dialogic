import { notification, UseDialog, useDialog } from "dialogic-react";
import React from "react";
import { Link, Route, useHistory, useRouteMatch } from "react-router-dom";
import { CurrentPathBadge } from "../components/CurrentPathBadge";
import {
  EditProfileDialog,
  EditProfileDialogProps,
} from "../components/EditProfileDialog";
import {
  saveConfirmationData,
  SaveConfirmationProps,
} from "../components/SaveConfirmation";
import { TStore } from "../store";

type Props = {
  /**
   * Used for e2e tests.
   */
  pathPrefix?: string;
  useDialogComponent?: boolean;
  store: TStore;
};

export const ProfilePage = ({
  pathPrefix = "",
  useDialogComponent,
  store,
}: Props) => {
  // Test injecting a dynamic value into the dialog

  const match = useRouteMatch();
  const history = useHistory();
  const dialogPath = `${match.url}/edit`;
  const dialogReturnPath = match.url;
  const matchDialogPath = useRouteMatch(dialogPath);

  const useDialogProps = {
    dialogic: {
      component: EditProfileDialog,
      className: "dialog",
    },
    pathPrefix,
    title: `Update your e-mail ${store.count}`,
    email: store.email,
    onSave: (newEmail: string) => {
      if (newEmail !== store.email) {
        store.setEmail(newEmail);
        notification.show<SaveConfirmationProps>(saveConfirmationData);
      }
      history.push(dialogReturnPath);
    },
    onCancel: () => {
      history.push(dialogReturnPath); // we could also pass dialogReturnPath to the dialog to use it as Link `to`
    },
    increment: store.increment,
  };

  useDialog<EditProfileDialogProps>({
    isIgnore: useDialogComponent,
    isShow: matchDialogPath ? matchDialogPath.isExact : false,
    deps: [store.count], // update the dialog contents whenever count changes
    props: useDialogProps,
  });

  return (
    <div data-test-id="profile-page">
      <h1 className="title">Profile</h1>
      <CurrentPathBadge />
      <div className="profile-tile">
        <div>
          <strong>Email</strong>
        </div>
        <div data-test-id="current-email">{store.email}</div>
        <Link
          className="button is-link"
          to={dialogPath}
          data-test-id="btn-edit-profile"
        >
          Edit
        </Link>
      </div>

      <div className="buttons">
        <Link
          className="button is-link is-light is-outlined"
          to={pathPrefix || "/"}
          data-test-id="btn-home"
        >
          Go to Home
        </Link>
      </div>
      {useDialogComponent && (
        <Route path={dialogPath}>
          <UseDialog<EditProfileDialogProps>
            isShow={matchDialogPath ? matchDialogPath.isExact : false}
            deps={[store.count]}
            props={useDialogProps}
          />
        </Route>
      )}
    </div>
  );
};
