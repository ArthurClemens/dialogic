import { useStoreContext } from "../../utils/store";
import React from "react";
import { CurrentPathBadge } from "../../components";
import Link from "next/link";
import { useRouter } from "next/router";
import { notification, UseDialog } from "dialogic-react";
import {
  EditProfileDialog,
  EditProfileDialogProps,
  saveConfirmationData,
  SaveConfirmationProps,
} from "../../components";
import { useDisplayLogic } from "./util";

const ProfilePage = () => {
  const store = useStoreContext();
  const router = useRouter();

  const { dialogPath, dialogAsPath, dialogReturnPath, isShowDialog } =
    useDisplayLogic();

  const useDialogProps = {
    dialogic: {
      component: EditProfileDialog,
      className: "dialog",
    },
    title: `Update your e-mail ${store.count}`,
    email: store.email,
    onSave: (newEmail: string) => {
      if (newEmail !== store.email) {
        store.setEmail(newEmail);
        notification.show<SaveConfirmationProps>(saveConfirmationData);
      }
      router.push(dialogReturnPath);
    },
    onCancel: () => {
      router.push(dialogReturnPath); // we could also pass dialogReturnPath to the dialog to use it as Link `to`
    },
    increment: store.increment,
  };

  return (
    <div data-test-id="profile-page">
      <h1 className="title">Profile</h1>
      <CurrentPathBadge />
      <div className="profile-tile">
        <div>
          <strong>Email</strong>
        </div>
        <div data-test-id="current-email">{store.email}</div>
        <Link href={dialogPath} as={dialogAsPath} shallow>
          <a data-test-id="btn-edit-profile" className="button is-link">
            Edit
          </a>
        </Link>
      </div>

      <div className="buttons">
        <Link href="/">
          <a
            className="button is-link is-light is-outlined"
            data-test-id="btn-home"
          >
            Go to Home
          </a>
        </Link>
      </div>
      <UseDialog<EditProfileDialogProps>
        isShow={isShowDialog}
        deps={[store.count]}
        props={useDialogProps}
      />
    </div>
  );
};

export default ProfilePage;
