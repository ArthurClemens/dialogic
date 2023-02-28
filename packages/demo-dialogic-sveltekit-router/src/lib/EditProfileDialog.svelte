<script lang="ts">
	export let title: string;
	export let email: string;
	export let onSave: (newEmail: string) => void;
	export let onCancel: () => void;
	export let increment: () => void;
</script>

<div class="modal is-active" data-test-id="edit-profile-dialog">
	<div class="modal-background" />
	<form
		class="modal-card"
		on:submit={(e) => {
			e.preventDefault();
			const form = e.currentTarget;
			const input = form.email;
			onSave(input.value);
		}}
	>
		<header class="modal-card-head">
			<p class="modal-card-title" data-test-id="title">{title}</p>
			<button class="delete" data-test-id="btn-close" on:click={onCancel} />
		</header>
		<section class="modal-card-body">
			<div class="field">
				<div class="control">
					<input class="input" type="email" name="email" value={email} data-test-id="input-email" />
				</div>
			</div>
		</section>
		<footer class="modal-card-foot">
			<div class="footer-buttons">
				<button type="submit" class="button is-link" data-test-id="btn-save"> Save changes </button>
				<a class="button is-link is-light is-outlined" href="/" data-test-id="btn-home">
					Go to Home
				</a>
				<button
					type="button"
					class="button is-link is-light is-outlined"
					data-test-id="btn-add-count"
					on:click={increment}
				>
					Dynamic title count
				</button>
				<button
					type="button"
					class="button is-danger is-light is-outlined"
					data-test-id="btn-cancel"
					on:click={onCancel}
				>
					Cancel
				</button>
			</div>
		</footer>
	</form>
</div>
