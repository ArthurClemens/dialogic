<script>
  import CurrentPathBadge from '../../components/CurrentPathBadge.svelte';
  import { email } from '../store';

  const dialogPath = '/profile/edit';
</script>

<div data-test-id="profile-page">
  <h1 class="title">Profile</h1>
  <CurrentPathBadge />

  <div class="profile-tile">
    <div><strong>Email</strong></div>
    <div data-test-id="current-email">{$email}</div>
    <a class="button is-link" href={dialogPath} data-test-id="btn-edit-profile">
      Edit
    </a>
  </div>

  <div class="buttons">
    <a
      class="button is-link is-light is-outlined"
      href={'/'}
      data-test-id="btn-home">
      Go to Home
    </a>
  </div>
  <slot />
</div>
