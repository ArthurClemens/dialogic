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
    className: "xxx-content",
    dialogic: {
      component: DefaultContent,
      styles: {
        showStart: {
          opacity: isOnMount ? "1" : "0",
        },
        showEnd: {
          transitionDuration: isOnMount ? "0ms" : "500ms",
          opacity: "1"
        },
        hideEnd: {
          transitionDuration: "500ms",
          opacity: "0"
        }
      },
      className: "xxx",
      spawn: "initial",
    }
  }
);

const toggleDialog = () => dialog.show(
  {
    title: getRandomId(),
    className: "xxx-content",
    dialogic: {
      component: DefaultContent,
      styles: {
        showEnd: {
          transitionDuration: "500ms",
        },
        hideEnd: {
          transitionDuration: "500ms",
        },
      }, 
      spawn: "toggle",
      className: "xxx",
      toggle: true
    },
  },
);

const dialogOneProps: Dialogic.Options = {
  dialogic: {
    component: DefaultContent,
    className: "xxx",
  },
  className: "xxx-content",
  title: "Clock",
  id: getRandomId(),
};

const dialogDelayProps: Dialogic.Options = {
  dialogic: {
    component: DefaultContent,
    className: "xxx-delay",
  },
  className: "xxx-content",
  title: "Delay",
  id: getRandomId(),
};

const dialogTransitionProps = {
  dialogic: {
    styles: (domElement: HTMLElement) => {
      const height = domElement.getBoundingClientRect().height;
      return {
        default: {
          transition: "all 300ms ease-in-out",
        },
        showStart: {
          opacity: "0",
          transform: `translate3d(0, ${height}px, 0)`,
        },
        showEnd: {
          opacity: "1",
          transform: "translate3d(0, 0px,  0)",
        },
        hideEnd: {
          transitionDuration: "750ms",
          transform: `translate3d(0, ${height}px, 0)`,
          opacity: "0",
        },
      }
    },
    // styles: {
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
  },
  title: "Transitions",
  id: getRandomId(),
};

const hideAllOptions = {
  styles: {
    hideEnd: {
      transitionDuration: "500ms",
      transitionDelay: "0ms",
      opacity: "0",
    }
  }
};

const showNotification = () => {
  const title = "N " + getRandomId();
  return notification.show(
    {
      dialogic: {
        didShow: (item: Dialogic.Item) => console.log("didShow", item, title),
        didHide: (item: Dialogic.Item) => console.log("didHide", item, title),
        component: DefaultContent,
        className: "xxx-timings",
        spawn: "NO"
      },
      className: "xxx-timings-content",
      title,
    },
  ).then((item: Dialogic.Item) => console.log("notification shown", item, title))
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
                  dialogic: {
                    ...dialogOneProps.dialogic,
                    id: dialogOneProps.id
                  },
                  title: dialogOneProps.title + ' ' + getRandomId(),
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
                  dialogic: {
                    component: DefaultContent,
                    className: "xxx",
                    didShow: (item: Dialogic.Item) => console.log("didShow", item),
                    didHide: (item: Dialogic.Item) => console.log("didHide", item),
                    styles: {
                      showEnd: {
                        transitionDuration: "500ms",
                        transitionDelay: "500ms",
                      },
                      hideEnd: {
                        transitionDuration: "250ms",
                        transitionDelay: "0ms",
                      },
                    },
                    id: "withPromise"
                  },
                  className: "xxx-content",
                  title: "With Promise"
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
                  dialogic: {
                    ...dialogDelayProps.dialogic,
                    id: dialogDelayProps.id
                  },
                  title: dialogDelayProps.title + " " + getRandomId()
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
      m("section", { className: "section" }, [
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  ...dialogOneProps,
                  dialogic: {
                    ...dialogOneProps.dialogic,
                    timeout: 2000,
                    id: "timer"
                  },
                  title: "Timeout " + dialogDelayProps.title + " " + getRandomId()
                }
              )    
          },
          "With timeout"
        ),
        
        dialog.exists({ id: "timer" })
          ? m.fragment({}, [
              m("div", `Is paused: ${dialog.isPaused({ id: "timer" })}`),
              m("div", m(Remaining, { getRemaining: () => dialog.getRemaining({ id: "timer" })})),
            ])
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
              dialog.resume({ id: "timer", minimumDuration: 2000 })
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
              dialog.show({
                ...dialogTransitionProps,
                dialogic: {
                  ...dialogTransitionProps.dialogic,
                  id: dialogTransitionProps.id
                }
              })    
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
                  dialogic: {
                    component: DefaultContent,
                    spawn: "special"
                  }
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
                  dialogic: {
                    component: DefaultContent,
                    className: "xxx",
                    queued: true,
                    spawn: "Q",
                  }
                },
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
            onclick: showNotification
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
              notification.resume({ spawn: "NO", minimumDuration: 2000 })
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
