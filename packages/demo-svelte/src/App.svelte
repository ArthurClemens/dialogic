<script>
  import { Notification, notification, Dialog, dialog } from "dialogic-svelte";
  import DefaultContent from "./default/Content.svelte";
  import IntervalContent from "./interval/Content.svelte";
  import Remaining from "./remaining/Remaining.svelte";

  const dialogCount = dialog.getCount();
  const timerDialogExists = dialog.exists({
    id: "timer"
  });

  const notificationCount = notification.getCount({
    spawn: "NO"
  });

  const notificationItemIsPaused = notification.isPaused({
    spawn: "NO"
  });
  const notificationExists = notification.exists({
    spawn: "NO"
  });

  const getRandomId = () => Math.round(1000 * Math.random()).toString();

  const showInitial = ({ isOnMount } = {}) => dialog.show(
  {
    title: getRandomId(),
    component: DefaultContent,
    showDuration: isOnMount
      ? 0
      : .5,
    hideDuration: 0.5,
    className: "xxx",
    showClassName: "xxx-visible",
  },
  {
    spawn: "initial",
  }
);

  $: showDialogs = true;
  $: showNotifications = false;

  const dialogOneProps = {
    showDuration: 0.5,
    showDelay: 0.25,
    hideDuration: 0.5,
    hideDelay: .25,
    component: IntervalContent,
    className: "xxx",
    showClassName: "xxx-visible",
    title: "Clock",
    id: getRandomId()
  };
  const dialogTwoProps = {
    showDuration: 0.75,
    showDelay: 0,
    hideDuration: 0.75,
    hideDelay: 0,
    component: DefaultContent,
    className: "xxx",
    showClassName: "xxx-visible",
    title: "Fade",
    id: getRandomId()
  };
  const dialogFourProps = {
    transitions: {
      show: domElement => {
        return {
          duration: 0.5,
          before: () => (
            (domElement.style.opacity = 0),
            (domElement.style.transform = "translate3d(0, 20px, 0)")
          ),
          transition: () => (
            (domElement.style.opacity = 1),
            (domElement.style.transform = "translate3d(0, 0px,  0)")
          )
        };
      },
      hide: domElement => {
        return { duration: 0.5, transition: () => domElement.style.opacity = 0 };
      },
    },
    component: DefaultContent,
    title: "Transitions",
    id: getRandomId()
  };

  const clearOptions = {
    transitions: {
      hide: domElement => {
        return { duration: 0.5, delay: 0, transition: () => domElement.style.opacity = 0 };
      }
    }
  };
</script>

<style>
  :global(.xxx) {
    opacity: 0;
  }
  :global(.xxx-visible) {
    opacity: 1;
  }
  :global(.xxx-timings) {
    opacity: 0;
    transition-duration: 500ms;
    transition-delay: 0;
  }
  :global(.xxx-visible-timings) {
    opacity: 1;
  }
</style>

<button on:click={() => notification.hideAll({ hideDelay: 0, hideDuration: .25 })}>Hide notifications</button>

<button on:click={() => notification.resetAll().catch(() => {})}>Reset notifications</button>

<button on:click={() => dialog.hideAll(clearOptions)}>Hide dialogs</button>

<button on:click={() => dialog.resetAll().catch(() => {})}>Reset dialogs</button>

<hr />

<button on:click={() => showDialogs = !showDialogs}>Toggle dialogs</button>

{#if showDialogs}

<h2>Dialog</h2>

<p>Dialog count = {$dialogCount} </p>

<hr />

<div>
  <button
    on:click={() => dialog.show({
      component: DefaultContent,
      title: "Default"
    })}>
    Default
  </button>
  <button on:click={() => dialog.hide()}>Hide</button>
</div>

<div>

  {#if $timerDialogExists}
    <Remaining getRemainingFn={() => dialog.getRemaining({
      id: "timer"
    })} />
  {/if}

  <button
    on:click={() => dialog.show(
      {
        timeout: 2000,
        component: DefaultContent,
        title: "With timer",
      },
      {
        id: "timer"
      })}>
    With timer
  </button>
  <button on:click={() => dialog.pause(
      {
        id: "timer"
      }
    )}>Pause</button>
  <button on:click={() => dialog.resume(
    {
      id: "timer"
    },
    {
      minimumDuration: 2000
    }
  )}>Resume</button>
  <button on:click={() => dialog.hide({ id: "timer" }).catch(() => console.log("caught"))}>Hide</button>
</div>

<div>
  <button
    on:click={() => dialog.show(
      {
        didShow: item => console.log("didShow", item),
        didHide: item => console.log("didHide", item),
        showDuration: 0.5,
        showDelay: 0.25,
        component: DefaultContent,
        title: "With Promise"
      },
      {
        id: "withPromise"
      }
    ).then(item => console.log("dialog shown", item))}>
    Show with promises
  </button>
  <button on:click={() => dialog.hide(
    {
      id: "withPromise"
    }).then(item => console.log("dialog hidden", item))}>Hide</button>
</div>

<div>
  <button
    on:click={() => dialog.show({
      ...dialogOneProps,
      showDelay: .5,
      hideDelay: 0,
      title: dialogOneProps.title + " " + getRandomId()
    }, { id: dialogOneProps.id })}>
    Show delay
  </button>
  <button on:click={() => dialog.hide({ id: dialogOneProps.id })}>Hide</button>
</div>
<div>
  <button
    on:click={() => dialog.show(dialogTwoProps, { id: dialogTwoProps.id })}>
    Show slow fade
  </button>
  <button on:click={() => dialog.hide({ id: dialogTwoProps.id })}>Hide</button>
</div>
<div>
  <button
    on:click={() => dialog.show(dialogFourProps, { id: dialogFourProps.id })}>
    Show transition
  </button>
  <button on:click={() => dialog.hide({ id: dialogFourProps.id })}>Hide</button>
</div>
<div>
  <button
    on:click={() => dialog.show({
      component: DefaultContent,
      title: "Custom spawn"
    }, { spawn: "special" })}>
    Show default in spawn
  </button>
  <button on:click={() => dialog.hide({ spawn: "special" })}>Hide</button>
</div>

<hr />

<div>
  <p>Dialog:</p>
  <Dialog />
</div>

<div>
  <p>Dialog with spawn:</p>
  <Dialog spawn="special" />
</div>

<hr />
Queued dialog
<div>
  <button
    on:click={() => dialog.show({
      component: DefaultContent,
      title: "Queued " + Math.round(1000 * Math.random())
    }, { spawn: "Q", queued: true })}>
    Queued
  </button>
  <button on:click={() => dialog.hide({ spawn: "Q" })}>Hide</button>
</div>

<div>
  <p>Dialog queued:</p>
  <Dialog spawn="Q" />
</div>

<hr />
Initially shown dialog
<div>
  <button
    on:click={() => showInitial()}>
    Initially shown
  </button>
  <button on:click={() => dialog.hide({ spawn: "initial" })}>Hide</button>
</div>

<div>
  <Dialog spawn="initial" onMount={
    () => showInitial({ isOnMount: true })
  } />
</div>

{/if}

<hr />

<button on:click={() => showNotifications = !showNotifications}>Toggle notifications</button>

{#if showNotifications}

<h2>Notification</h2>
<p>Notification count: {$notificationCount} </p>
<p>Notification exists: {$notificationExists} </p>
<p>Is paused: {$notificationItemIsPaused} </p>

<div>
  <button
    on:click={() => {
      const title = "N " + getRandomId();
      notification.show(
        {
          didShow: item => console.log("didShow", item, title),
          didHide: item => console.log("didHide", item, title),
          component: DefaultContent,
          className: "xxx-timings",
          showClassName: "xxx-visible-timings",
          title
        },
        {
          spawn: "NO"
        }
      ).then(item => console.log("notification shown", item, title))}
    }
    >
    Queued
  </button>
  <button on:click={e => (
    notification.hide(
      {
        spawn: "NO"
      }
    )).then(item => console.log("notification hidden from App", item))}>Hide</button>
  <button on:click={() => notification.pause(
      {
        spawn: "NO"
      }
    )}>Pause</button>
  <button on:click={() => notification.resume(
    {
      spawn: "NO"
    }
  )}>Resume</button>
</div>

<Notification spawn="NO" />

<hr />

{/if}

