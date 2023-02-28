<script context="module" lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<script lang="ts">
	import { email, counter, increment } from '$lib/store';
	import CurrentPathBadge from '$lib/CurrentPathBadge.svelte';
	import { notification, UseDialog } from 'dialogic-svelte-ts';
	import SaveConfirmation, { createSaveConfirmationData } from '$lib/SaveConfirmation.svelte';
	import EditProfileDialog from '$lib/EditProfileDialog.svelte';

	/* Location */
	const dialogPath = '/profile/edit';
	const dialogReturnPath = '/profile';
	$: isMatchDialogPath = $page.route.id === dialogPath;

	// UseDialog props
	// Make props reactive so that the title gets updated with changes to counter
	$: useDialogProps = {
		dialogic: {
			component: EditProfileDialog,
			className: 'dialog'
		},
		title: `Update your e-mail ${$counter}`,
		email: $email,
		onSave: (newEmail: string) => {
			if (newEmail !== $email) {
				email.set(newEmail);
				notification.show(createSaveConfirmationData(SaveConfirmation));
			}
			goto(dialogReturnPath);
		},
		onCancel: () => {
			goto(dialogReturnPath); // we could also pass dialogReturnPath to the dialog to use it as a link href
		},
		increment
	};
</script>

<div data-test-id="profile-page">
	<h1 class="title">Profile</h1>
	<CurrentPathBadge />
	<div class="profile-tile">
		<div>
			<strong>Email</strong>
		</div>
		<div data-test-id="current-email">{$email}</div>
		<a href={dialogPath} data-test-id="btn-edit-profile" class="button is-link"> Edit </a>
	</div>

	<div class="buttons">
		<a href="/" class="button is-link is-light is-outlined" data-test-id="btn-home"> Go to Home </a>
	</div>
	<UseDialog isShow={isMatchDialogPath} props={useDialogProps} deps={[$counter]} />
</div>
