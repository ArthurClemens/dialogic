<script>
  import { UseDialog, notification } from 'dialogic-svelte';
  import { goto } from '@sapper/app';
  import SaveConfirmation, {
    createSaveConfirmationProps,
  } from '../../components/SaveConfirmation.svelte';
  import { email, counter, increment } from '../store';
  import EditProfileDialog from '../../components/EditProfileDialog.svelte';
  /* Location */
  const dialogReturnPath = '/profile';

  // UseDialog props
  // Make props reactive so that the title gets updated with changes to counter
  $: useDialogProps = {
    dialogic: {
      component: EditProfileDialog,
      className: 'dialog',
    },
    title: `Update your e-mail ${$counter}`,
    email: $email,
    onSave: newEmail => {
      if (newEmail !== $email) {
        email.set(newEmail);
        notification.show(createSaveConfirmationProps(SaveConfirmation));
      }
      goto(dialogReturnPath);
    },
    onCancel: () => {
      goto(dialogReturnPath); // we could also pass dialogReturnPath to the dialog to use it as a link href
    },
    increment,
  };
</script>

<UseDialog props={useDialogProps} isShow deps={[$counter]} />
