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
    className: "xxx-content",
    dialogic: {
      component: DefaultContent,
      styles: {
        showStart: {
          opacity: isOnMount ? 1 : 0,
        },
        showEnd: {
          transitionDuration: isOnMount ? 0 : "500ms",
          opacity: 1
        },
        hideEnd: {
          transitionDuration: "500ms",
          opacity: 0
        }
      },
      className: "xxx",
    },
  },
  {
    spawn: "initial",
  }
);

  $: showDialogs = true;
  $: showNotifications = false;

  const dialogOneProps = {
    component: DefaultContent,
    dialogic: {
      styles: {
        showEnd: {
          transitionDuration: "500ms",
        },
        hideEnd: {
          transitionDuration: "500ms",
        },
      },
      className: "xxx",
    },
    className: "xxx-content",
    title: "Clock",
    id: getRandomId(),
  };
  const dialogSlowFadeProps = {
    dialogic: {
      component: DefaultContent,
      className: "xxx",
      styles: {
        showEnd: {
          transitionDelay: 0,
          transitionDuration: "1s"
        },
        hideEnd: {
          transitionDelay: 0,
          transitionDuration: "1s"
        },
      }
    },
    className: "xxx-content",
    title: "Fade",
    id: getRandomId()
  };

  const dialogDelayProps = {
  // transitionStyles: {
  //   default: {
  //     transitionDuration: "750ms",
  //     transitionDelay: "250ms",
  //   },
  // },
  className: "xxx-content",
  dialogic: {
    component: DefaultContent,
    className: "xxx-delay",
  },
  title: "Delay",
  id: getRandomId(),
};

  const dialogFourProps = {
    dialogic: {
      styles: domElement => {
        const height = domElement.getBoundingClientRect().height;
        return {
          default: {
            transition: "all 300ms ease-in-out",
          },
          showStart: {
            opacity: 0,
            transform: `translate3d(0, ${height}px, 0)`,
          },
          showEnd: {
            opacity: 1,
            transform: "translate3d(0, 0px,  0)",
          },
          hideEnd: {
            transform: `translate3d(0, ${height}px, 0)`,
            opacity: 0,
          },
        }
      },
      component: DefaultContent,
    },
    title: "Transitions",
    id: getRandomId()
  };

  const hideAllOptions = {
    styles: {
      hideEnd: {
        transitionDuration: "500ms",
        transitionDelay: "0ms",
        opacity: 0,
      }
    }
  };
</script>

<style>
  :global(.xxx) {
    opacity: 0;
    transition: opacity 200ms;
  }
  :global(.xxx-show-start) {
    opacity: 0;
  }
  :global(.xxx-show-end) {
    opacity: 1;
  }
  :global(.xxx-exit) {
    opacity: 1;
  }
  :global(.xxx-hide-end) {
    opacity: 0;
  }

  :global(.xxx-delay-show-start) {
    opacity: 0;
  }
  :global(.xxx-delay-show-end) {
    opacity: 1;
    transition: opacity 750ms 250ms;
  }
  :global(.xxx-delay-exit) {
    opacity: 1;
  }
  :global(.xxx-delay-hide-end) {
    opacity: 0;
    transition: opacity 750ms 250ms;
  }

  :global(.xxx-timings) {
    transition-duration: 500ms;
    transition-delay: 0;
  }
  :global(.xxx-timings-show-start) {
    opacity: 0;
    transition-duration: 500ms;
    transition-delay: 0;
  }
  :global(.xxx-timings-show-end) {
    opacity: 1;
  }
  :global(.xxx-timings-hide-end) {
    opacity: 0;
  }
</style>

<button on:click={() => notification.hideAll({ hideDelay: 0, hideDuration: .25 })}>Hide notifications</button>

<button on:click={() => notification.resetAll().catch(() => {})}>Reset notifications</button>

<button on:click={() => dialog.hideAll(hideAllOptions)}>Hide dialogs</button>

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
      title: "Default",
      dialogic: {
        component: DefaultContent,
        className: "xxx",
      },
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
        dialogic: {
          timeout: 2000,
          component: DefaultContent,
        },
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
        dialogic: {
          didShow: item => console.log("didShow", item),
          didHide: item => console.log("didHide", item),
          styles: {
            startEnd: {
              transitionDuration: "500ms",
            },
            hideEnd: {
              transitionDuration: "250ms",
            },
          },
          component: DefaultContent,
          className: "xxx",
        },
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
      ...dialogDelayProps,
      title: dialogOneProps.title + " " + getRandomId()
    }, { id: dialogOneProps.id })}>
    Show delay
  </button>
  <button on:click={() => dialog.hide({ id: dialogOneProps.id })}>Hide</button>
</div>
<div>
  <button
    on:click={() => dialog.show(dialogSlowFadeProps, { id: dialogSlowFadeProps.id })}>
    Show slow fade
  </button>
  <button on:click={() => dialog.hide({ id: dialogSlowFadeProps.id })}>Hide</button>
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
      dialogic: {
        component: DefaultContent,
      },
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
      dialogic: {
        component: DefaultContent,
      },
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
          dialogic: {
            didShow: item => console.log("didShow", item, title),
            didHide: item => console.log("didHide", item, title),
            component: DefaultContent,
            className: "xxx-timings",
          },
          className: "xxx-timings-content",
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

