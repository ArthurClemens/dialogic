<script>
  import { prevent_default } from 'svelte/internal';

  export let title;
  export let email;
  export let onSave;
  export let onCancel;

  let newEmail = email;
</script>

<div class="modal is-active" data-test-id="edit-profile-dialog">
  <div class="modal-background" />
  <form
    class="modal-card"
    on:submit={e => {
      e.preventDefault();
      onSave(newEmail);
    }}>
    <header class="modal-card-head">
      <p class="modal-card-title" data-test-id="title">{title}</p>
      <button class="delete" data-test-id="btn-close" on:click={onCancel} />
    </header>
    <section class="modal-card-body">
      <div class="field">
        <div class="control">
          <input
            class="input"
            type="text"
            data-test-id="input-email"
            bind:value={newEmail} />
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="footer-buttons">
        <button
          type="submit"
          class="button is-link"
          data-test-id="btn-save"
          on:click={e => {
            e.preventDefault();
            onSave(newEmail);
          }}>
          Save changes
        </button>
        <button
          type="button"
          class="button is-danger is-light is-outlined"
          data-test-id="btn-cancel"
          on:click={onCancel}>
          Cancel
        </button>
      </div>
    </footer>
  </form>
</div>
