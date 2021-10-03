<script>
  import { Dialog, notification, Notification } from "../../dialogic-svelte";
  import NotificationComponent from "./NotificationComponent.svelte";
  import RemainingLabel from "./RemainingLabel.svelte";

  const notificationIsPaused = notification.isPaused();
  const notificationExists = notification.exists();
  const notificationCount = notification.getCount();
</script>

<div class="page">
  <main>
    <h1>Dialogic for Svelte demo</h1>
    <div class="message">
      Add one or more notifications, then click on the Retry button in the
      message.
    </div>
    <div class="ui message">
      <button
        class="ui button primary"
        on:click={() => {
          notification.show({
            dialogic: {
              component: NotificationComponent,
              className: "notification",
              timeout: 4000,
            },
          });
        }}
      >
        Add notification
      </button>
      <button
        class="ui button"
        on:click={() => {
          notification.pause();
        }}
      >
        Pause
      </button>
      <button
        class="ui button"
        on:click={() => {
          notification.resume();
        }}
      >
        Resume
      </button>
      <button
        class="ui button"
        on:click={() => {
          notification.hideAll();
        }}
      >
        Hide all
      </button>
      <button
        class="ui button"
        on:click={() => {
          notification.resetAll();
        }}
      >
        Reset all
      </button>
    </div>
    <div class="ui message">
      <div class="ui label">
        Notifications
        <div class="detail">
          {$notificationCount}
        </div>
      </div>
      <div class="ui label">
        Is paused
        <div class="detail">
          {$notificationIsPaused}
        </div>
      </div>
      {#if $notificationExists}
        <div class="ui label">
          Remaining
          <div class="detail">
            <RemainingLabel instance={notification} roundToSeconds={false} />
          </div>
        </div>
      {/if}
    </div>
  </main>
  <footer>
    Dialogic: manage dialogs and notifications. <a
      href="https://github.com/ArthurClemens/dialogic"
      >Main documentation on GitHub</a
    >
  </footer>
</div>
<Dialog />
<Notification />
