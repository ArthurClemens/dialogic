import m from "mithril";
import { Dialogic } from "dialogic";
import { dialog, Dialog, notification, Notification } from "dialogic-mithril";
import { Content as DefaultContent } from "./default/Content";
import { Remaining } from "./Remaining";

import "./styles.css";

const getRandomId = () => Math.round(1000 * Math.random()).toString();

const showInitial = ({ isOnMount } : { isOnMount?: boolean } = {} ) => dialog.show(
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

const toggleDialog = () => dialog.toggle(
  {
    title: getRandomId(),
    component: DefaultContent,
    showDuration: 0.5,
    hideDuration: 0.5,
    className: "xxx",
    showClassName: "xxx-visible",
  },
  {
    spawn: "toggle",
  }
);

const dialogOneProps: Dialogic.Options = {
  component: DefaultContent,
  showDuration: 0.5,
  hideDuration: 0.5,
  className: "xxx",
  showClassName: "xxx-visible",
  title: "Clock",
  id: getRandomId(),
};

const dialogThreeProps: Dialogic.Options = {
  showDuration: 0.75,
  showDelay: 0.25,
  hideDuration: 0.75,
  hideDelay: .25,
  component: DefaultContent,
  className: "xxx",
  showClassName: "xxx-visible",
  title: "Delay",
  id: getRandomId(),
};

const dialogFourProps = {
  transitions: {
    show: (domElements: { domElement: HTMLElement }) => {
      const el = domElements.domElement;
      return {
        duration: 0.5,
        before: () => (
          (el.style.opacity = "0"),
          (el.style.transform = "translate3d(0, 20px, 0)")
        ),
        transition: () => (
          (el.style.opacity = "1"),
          (el.style.transform = "translate3d(0, 0px,  0)")
        )
      };
    },
    hide: (domElements: { domElement: HTMLElement }) => {
      const el = domElements.domElement;
      return { duration: 0.5, transition: () => el.style.opacity = "0" };
    },
  },
  component: DefaultContent,
  title: "Transitions",
  id: getRandomId(),
};

const clearOptions = {
  transitions: {
    hide: (domElements: { domElement: HTMLElement }) => {
      const el = domElements.domElement;
      return { duration: 0.5, delay: 0, transition: () => el.style.opacity = "0" };
    }
  }
};

const App = {
  view: () => 
    m(".demo", [
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () => notification.hideAll(clearOptions)
          },
          "Hide notifications"
        ),
        m("button",
          {
            className: "button",
            onclick: () => notification.resetAll()
          },
          "Reset notifications"
        ),
        m("button",
          {
            className: "button",
            onclick: () => dialog.hideAll(clearOptions)
          },
          "Hide dialogs"
        ),
        m("button",
          {
            className: "button",
            onclick: () => dialog.resetAll()
          },
          "Reset dialogs"
        ),
      ]),
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Dialog"),
      ]),
      m("section", { className: "section"}, [
        m("div",
          m("p", `Dialog count: ${dialog.getCount({ spawn: dialog.defaultSpawn })}`)
        ),
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  ...dialogOneProps,
                  title: dialogOneProps.title + ' ' + getRandomId(),
                },
                {
                  id: dialogOneProps.id
                }
              )    
          },
          "Show dialog"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ id: dialogOneProps.id })
          },
          "Hide"
        ),
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  didShow: (item: Dialogic.Item) => console.log("didShow", item),
                  didHide: (item: Dialogic.Item) => console.log("didHide", item),
                  showDuration: 0.5,
                  showDelay: 0.25,
                  component: DefaultContent,
                  title: "With Promise"
                },
                {
                  id: "withPromise"
                }
              ).then((item: Dialogic.Item) => console.log("dialog shown", item)) 
          },
          "Show with promises"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ id: "withPromise" })
                .then((item: Dialogic.Item) => console.log("dialog hidden", item))
          },
          "Hide"
        ),
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  ...dialogOneProps,
                  showDelay: .5,
                  hideDelay: 0,
                  title: dialogThreeProps.title + " " + getRandomId()
                },
                {
                  id: dialogThreeProps.id
                }
              )    
          },
          "Show delay"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ id: dialogThreeProps.id })
          },
          "Hide"
        ),
      ]),

      // Timer
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  ...dialogOneProps,
                  timeout: 2000,
                  title: dialogThreeProps.title + " " + getRandomId()
                },
                {
                  id: "timer"
                }
              )    
          },
          "With timeout"
        ),
        m("div", `Is paused: ${dialog.isPaused({ id: "timer" })}`),
        dialog.exists({ id: "timer" })
          ? m("div", m(Remaining, { getRemaining: () => dialog.getRemaining({ id: "timer" })}))
          : null,
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.pause({ id: "timer" })
          },
          "Pause"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.resume({ id: "timer" }, { minimumDuration: 2000 })
          },
          "Resume"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ id: "timer" })
          },
          "Hide"
        ),
      ]),

      // Transition
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                dialogFourProps,
                {
                  id: dialogFourProps.id
                }
              )    
          },
          "Show transition"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ id: dialogFourProps.id })
          },
          "Hide"
        ),
      ]),
      m("section", { className: "section"}, [
        m(Dialog),
      ]),

      // Spawn
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Dialog with spawn"),
        m("p", `Dialog count: ${dialog.getCount({ spawn: "special" })}`)
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  title: "Custom spawn",
                  component: DefaultContent,
                },
                {
                  spawn: "special"
                }
              )
          },
          "Show default in spawn"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({
                spawn: "special"
              })
          },
          "Hide"
        ),
      ]),
      m("section", { className: "section"}, [
        m(Dialog, { spawn: "special" })
      ]),

      // Queued
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Queued dialog"),
        m("p", `Dialog count: ${dialog.getCount({ spawn: "Q" })}`)
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  title: getRandomId(),
                  component: DefaultContent,
                  showDuration: 0.5,
                  hideDuration: 0.5,
                  className: "xxx",
                  showClassName: "xxx-visible",
                },
                {
                  spawn: "Q",
                  queued: true
                }
              )    
          },
          "Queued dialog"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ spawn: "Q" })
          },
          "Hide"
        ),
      ]),
      m("section", { className: "section"}, [
        m(Dialog, { spawn: "Q" }),
      ]),

      // Initially displayed
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Initially displayed dialog"),
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () => showInitial()
          },
          "Shown initially"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ spawn: "initial" })
          },
          "Hide"
        ),
      ]),
      m("section", { className: "section"}, [
        m(Dialog, {
          spawn: "initial",
          onMount: () => showInitial({ isOnMount: true })
        }),
      ]),

      // Toggle
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Toggle"),
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: toggleDialog
          },
          "Toggle"
        ),
      ]),
      m("section", { className: "section"}, [
        m(Dialog, {
          spawn: "toggle",
        }),
      ]),
      
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Notification"),
        m("div", `Notification count: ${notification.getCount()}`),
        m("div", `Is shown: ${notification.exists({ spawn: "NO" })}`),
        m("div", `Is paused: ${notification.isPaused({ spawn: "NO" })}`),
        notification.exists({ spawn: "NO" })
          ? m("div", m(Remaining, { getRemaining: () => notification.getRemaining({ spawn: "NO" })}))
          : null,
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () => {
              const title = "N " + getRandomId();
              return notification.show(
                {
                  didShow: (item: Dialogic.Item) => console.log("didShow", item, title),
                  didHide: (item: Dialogic.Item) => console.log("didHide", item, title),
                  component: DefaultContent,
                  className: "xxx-timings",
                  showClassName: "xxx-visible-timings",
                  title,
                },
                {
                  spawn: "NO"
                }
              ).then((item: Dialogic.Item) => console.log("notification shown", item, title))
            } 
          },
          "Show notification"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              notification.pause({ spawn: "NO" })
          },
          "Pause"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              notification.resume({ spawn: "NO" }, { minimumDuration: 2000 })
          },
          "Resume"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              notification.hide({ spawn: "NO" }).then((item: Dialogic.Item) => console.log("notification hidden from App", item))
          },
          "Hide"
        ),
      ]),
      m("section", { className: "section"}, [
        m(Notification, { spawn: "NO" })
      ]),
    ]),
};

m.route.prefix = "#";
const mountNode = document.body;
const routes = {
  "/": App
};
m.route(mountNode, "/", routes);
