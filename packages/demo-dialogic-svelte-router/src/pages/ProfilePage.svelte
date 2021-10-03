<script>
  import { notification, UseDialog } from "dialogic-svelte";
  import { link, location, push } from "svelte-spa-router";
  import CurrentPathBadge from "../components/CurrentPathBadge.svelte";
  import EditProfileDialog from "../components/EditProfileDialog.svelte";
  import SaveConfirmation, {
    createSaveConfirmationProps,
  } from "../components/SaveConfirmation.svelte";
  import { counter, email, increment } from "../store";

  /* Location */
  const dialogPath = "/profile/edit";
  const dialogReturnPath = "/profile";
  $: isMatchDialogPath = $location === dialogPath;

  // UseDialog props
  // Make props reactive so that the title gets updated with changes to counter
  $: useDialogProps = {
    dialogic: {
      component: EditProfileDialog,
      className: "dialog",
    },
    title: `Update your e-mail ${$counter}`,
    email: $email,
    onSave: (newEmail) => {
      if (newEmail !== $email) {
        email.set(newEmail);
        notification.show(createSaveConfirmationProps(SaveConfirmation));
      }
      push(dialogReturnPath);
    },
    onCancel: () => {
      push(dialogReturnPath); // we could also pass dialogReturnPath to the dialog to use it as a link href
    },
    increment,
  };
</script>

<div data-test-id="profile-page">
  <h1 class="title">Profile</h1>
  <CurrentPathBadge />

  <div class="profile-tile">
    <div><strong>Email</strong></div>
    <div data-test-id="current-email">{$email}</div>
    <a
      class="button is-link"
      href={dialogPath}
      use:link
      data-test-id="btn-edit-profile"
    >
      Edit
    </a>
  </div>

  <div class="buttons">
    <a
      class="button is-link is-light is-outlined"
      href={"/"}
      use:link
      data-test-id="btn-home"
    >
      Go to Home
    </a>
  </div>
  <UseDialog
    props={useDialogProps}
    isShow={isMatchDialogPath}
    deps={[$counter]}
  />
</div>
