<script>
  import { Notification, notification } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import { createFns } from "./createFns.ts";

  const fns1 = createFns({ instance: notification, component: Default, className: "notification", title: "Default" });
  const fns2 = createFns({ instance: notification, component: Default, className: "notification", id: "1", title: "ID" });
  const fns3 = createFns({ instance: notification, component: Default, className: "notification", spawn: "1", title: "Spawn" });
  const fns4 = createFns({ instance: notification, component: Default, className: "notification", spawn: "1", id: "1", title: "Spawn and ID" });
  const notificationCount = notification.getCount();
  const notificationCountId1 = notification.getCount({ id: "1" });
  const notificationCountSpawn1 = notification.getCount({ spawn: "1" });
  const notificationCountSpawn1Id1 = notification.getCount({ spawn: "1", id: "1" });
</script>

<div class="test">
  <div class="control" data-test-id="count-all">{`Count all: ${$notificationCount}`}</div>
  <div class="control" data-test-id="count-id">{`Count id: ${$notificationCountId1}`}</div>
  <div class="control" data-test-id="count-spawn">{`Count spawn: ${$notificationCountSpawn1}`}</div>
  <div class="control" data-test-id="count-spawn-id">{`Count spawn, id: ${$notificationCountSpawn1Id1}`}</div>
  <div class="control">
    <div class="buttons">
      <button class="button" data-test-id="button-reset" on:click={() => notification.resetAll()}>
        Reset
      </button>
    </div>
  </div>
  <div class="content">
    <Buttons {...fns1} />
    <Buttons {...fns2} id="1" />
    <Buttons {...fns3} spawn="1" />
    <Buttons {...fns4} spawn="1" id="1" />
  </div>
  <div class="spawn default-spawn">
    <Notification />
  </div>
  <div class="spawn custom-spawn">
    <Notification spawn="1" />
  </div>
</div>
