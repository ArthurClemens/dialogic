<script>
  import { dialog, notification } from 'dialogic-svelte';
  import EditProfileDialog from '../components/EditProfileDialog.svelte';
  import { email } from './store';
  import SaveConfirmation, {
    createSaveConfirmationProps,
  } from '../components/SaveConfirmation.svelte';
</script>

<style>
  button,
  p {
    text-align: center;
    margin: 0 auto;
  }

  button {
    display: inline-block;
  }

  p {
    margin: 1em auto;
  }
</style>

<svelte:head>
  <title>Dialogic and Sapper demo</title>
</svelte:head>

<p><strong>{$email}</strong></p>
<p>
  <button
    class="button"
    on:click={() => {
      dialog.show({
        dialogic: {
          component: EditProfileDialog,
          className: 'dialog',
        },
        title: 'Your current email address',
        email: $email,
        onSave: newEmail => {
          if (newEmail !== $email) {
            email.set(newEmail);
            notification.show(createSaveConfirmationProps(SaveConfirmation));
          }
          dialog.hide();
        },
        onCancel: () => {
          dialog.hide();
        },
      });
    }}>
    Update
  </button>
</p>
