<script>
  import { Notification, notification, Dialog, dialog } from "dialogic-svelte";
  import DefaultContent from "./default/Content.svelte";
  import IntervalContent from "./interval/Content.svelte";

  const dialogCount = dialog.count;
  const notificationCount = notification.count;

  const getRandomNumber = () => Math.round(1000 * Math.random());

  $: showDialogs = true;
  $: showNotifications = true;

  const dialogOneProps = {
    showDuration: 0.5,
    showDelay: 0.25,
    hideDuration: 0.5,
    hideDelay: .25,
    component: IntervalContent,
    className: "xxx",
    showClassName: "xxx-visible",
    instanceOptions: { 
      title: "Clock"
    }
  };
  const dialogTwoProps = {
    showDuration: 0.75,
    showDelay: 0,
    hideDuration: 0.75,
    hideDelay: 0,
    component: DefaultContent,
    className: "xxx",
    showClassName: "xxx-visible",
    instanceOptions: { 
      title: "Fade"
    }
  };
  const dialogFourProps = {
    transitions: {
      show: domElements => {
        const el = domElements.domElement;
        return {
          duration: 0.5,
          before: () => (
            (el.style.opacity = 0),
            (el.style.transform = "translate3d(0, 20px, 0)")
          ),
          transition: () => (
            (el.style.opacity = 1),
            (el.style.transform = "translate3d(0, 0px,  0)")
          )
        };
      },
      hide: domElements => {
        const el = domElements.domElement;
        return { duration: 0.5, transition: () => el.style.opacity = 0 };
      },
    },
    component: DefaultContent,
    instanceOptions: { 
      title: "Transitions"
    }
  };

  const clearOptions = {
    transitions: {
      hide: domElements => {
        const el = domElements.domElement;
        return { duration: 0.5, delay: 0, transition: () => el.style.opacity = 0 };
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
</style>


<button on:click={() => notification.hideAll({ hideDelay: 0, hideDuration: .25 })}>Clear notifications</button>

<button on:click={() => notification.resetAll().catch(() => {})}>Reset notifications</button>

<button on:click={() => dialog.hideAll(clearOptions)}>Clear dialogs</button>

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
      instanceOptions: { 
        title: "Default"
      }
    })}>
    Default
  </button>
  <button on:click={() => dialog.hide()}>Hide</button>
</div>

<div>
  <button
    on:click={() => dialog.show({
      timeout: 2000,
      component: DefaultContent,
      instanceOptions: { 
        title: "With timer"
      }
    })}>
    With timer
  </button>
  <button on:click={() => dialog.hide().catch(() => console.log("caught"))}>Hide</button>
</div>

<div>
  <button
    on:click={() => dialog.show(
      {
        didShow: id => console.log("didShow", id),
        didHide: id => console.log("didHide", id),
        showDuration: 0.5,
        showDelay: 0.25,
        component: DefaultContent,
        instanceOptions: { 
          title: "With Promise"
        }
      },
      {
        id: "withPromise"
      }
    ).then(id => console.log("dialog shown", id))}>
    Show with promises
  </button>
  <button on:click={() => dialog.hide(
    {
      id: "withPromise"
    }).then(id => console.log("dialog hidden", id))}>Hide</button>
</div>

<div>
  <button
    on:click={() => dialog.show({
      ...dialogOneProps,
      showDelay: .5,
      hideDelay: 0,
      instanceOptions: { 
        title: dialogOneProps.instanceOptions.title + ' ' + getRandomNumber()
      }
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
      instanceOptions: { 
        title: "Custom spawn"
      }
    }, { spawn: 'special' })}>
    Show default in spawn
  </button>
  <button on:click={() => dialog.hide({ spawn: 'special' })}>Hide</button>
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
      instanceOptions: { 
        title: 'Queued ' + Math.round(1000 * Math.random())
      }
    }, { spawn: 'Q', queued: true })}>
    Queued
  </button>
  <button on:click={() => dialog.hide({ spawn: 'Q' })}>Hide</button>
</div>

<div>
  <p>Dialog queued:</p>
  <Dialog spawn="Q" />
</div>

{/if}

<hr />

<button on:click={() => showNotifications = !showNotifications}>Toggle notifications</button>

{#if showNotifications}

<h2>Notification</h2>

<div>
  <button
    on:click={() => notification.show(
      {
        didShow: id => console.log("didShow", id),
        didHide: id => console.log("didHide", id),
        showDuration: 0.5,
        showDelay: 0.25,
        hideDuration: 0.5,
        hideDelay: .25,
        component: DefaultContent,
        className: "xxx",
        showClassName: "xxx-visible",
        instanceOptions: { 
          title: 'N ' + getRandomNumber(),
        }
      },
      {
        spawn: 'NO'
      }
    ).then(id => console.log("notification shown", id))}>
    Queued
  </button>
  <button on:click={() => notification.hide(
      {
        spawn: 'NO'
      }
    ).then(id => console.log("notification hidden from App", id))}>Hide</button>
  <button on:click={() => notification.pause(
      {
        spawn: 'NO'
      }
    )}>Pause</button>
  <button on:click={() => notification.resume(
    {
      spawn: 'NO'
    }
  )}>Resume</button>
</div>

<div>
  <p>Notification queued:</p>
  <p>Notification count = {$notificationCount} </p>
  <Notification spawn="NO" />
</div>

<hr />

{/if}

