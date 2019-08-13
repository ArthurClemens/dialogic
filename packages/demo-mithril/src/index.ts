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
    transitionStyles: {
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
    className: "xxx-content",
    transitionClassName: "xxx",
  },
  {
    spawn: "initial",
  }
);

const toggleDialog = () => dialog.toggle(
  {
    title: getRandomId(),
    component: DefaultContent,
    transitionStyles: {
      showEnd: {
        transitionDuration: "500ms",
      },
      hideEnd: {
        transitionDuration: "500ms",
      },
    },
    className: "xxx-content",
    transitionClassName: "xxx"
  },
  {
    spawn: "toggle",
  }
);

const dialogOneProps: Dialogic.Options = {
  component: DefaultContent,
  transitionStyles: {
    showEnd: {
      transitionDuration: "500ms",
    },
    hideEnd: {
      transitionDuration: "500ms",
    },
  },
  className: "xxx-content",
  transitionClassName: "xxx",
  title: "Clock",
  id: getRandomId(),
};

const dialogDelayProps: Dialogic.Options = {
  // transitionStyles: {
  //   default: {
  //     transitionDuration: "750ms",
  //     transitionDelay: "250ms",
  //   },
  // },
  component: DefaultContent,
  className: "xxx-content",
  transitionClassName: "xxx-delay",
  title: "Delay",
  id: getRandomId(),
};

const dialogTransitionProps = {
  transitionStyles: (domElement: HTMLElement) => {
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
        transitionDuration: "750ms",
        transform: `translate3d(0, ${height}px, 0)`,
        opacity: 0,
      },
    }
  },
  // transitionStyles: {
  //   default: {
  //     transition: `all ${300}ms ease-in-out`,
  //   },
  //   showStart: {
  //     opacity: 0,
  //     transform: `translate3d(0, ${84}px, 0)`,
  //     transitionDuration: "0ms"
  //   },
  //   showEnd: {
  //     opacity: 1,
  //     transform: "translate3d(0, 0px,  0)"
  //   },
  //   hideEnd: {
  //     transitionDuration: "750ms",
  //     opacity: 0,
  //   },
  // },
  component: DefaultContent,
  title: "Transitions",
  id: getRandomId(),
};

const hideAllOptions = {
  transitionStyles: {
    hideEnd: {
      transitionDuration: "500ms",
      transitionDelay: "0ms",
      opacity: "0ms"
    }
  }
  // transitions: {
  //   hide: (domElement: HTMLElement ) => {
  //     return { duration: 0.5, delay: 0, transition: () => domElement.style.opacity = "0" };
  //   }
  // }
};

const App = {
  view: () => 
    m(".demo", [
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () => notification.hideAll(hideAllOptions)
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
            onclick: () => dialog.hideAll(hideAllOptions)
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
                  transitionStyles: {
                    showEnd: {
                      transitionDuration: "500ms",
                      transitionDelay: "500ms",
                    },
                    hideEnd: {
                      transitionDuration: "250ms",
                      transitionDelay: "0ms",
                    },
                  },
                  component: DefaultContent,
                  className: "xxx-content",
                  transitionClassName: "xxx",
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
                  ...dialogDelayProps,
                  title: dialogDelayProps.title + " " + getRandomId()
                },
                {
                  id: dialogDelayProps.id
                }
              )    
          },
          "Show delay"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ id: dialogDelayProps.id })
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
                  title: dialogDelayProps.title + " " + getRandomId()
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
                dialogTransitionProps,
                {
                  id: dialogTransitionProps.id
                }
              )    
          },
          "Show transition"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ id: dialogTransitionProps.id })
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
                  className: "xxx-timings-content",
                  transitionClassName: "xxx-timings",
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
