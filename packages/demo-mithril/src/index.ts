import m from "mithril";
import { Dialogic } from "dialogic";
import { dialog, Dialog, notification, Notification } from "dialogic-mithril";
import { Content as DefaultContent } from "./default/Content";

import "./styles.css";

console.log("dialog", dialog);
console.log("Dialog", Dialog);

const Remaining = ({ attrs } : { attrs: { getRemaining: () => number | undefined }}) => {
  let displayValue: number | undefined;
  const update = () => {
    const remaining = attrs.getRemaining();
    if (remaining !== undefined) {
      if (displayValue !== remaining) {
        m.redraw();
        displayValue = Math.max(remaining, 0);
      }
    } else {
      displayValue = undefined;
      m.redraw();
    }
    window.requestAnimationFrame(update);
  };
  
  update();

  return {
    view: () => 
      m("div", `Remaining: ${displayValue}`)
  }
};


const getRandomNumber = () => Math.round(1000 * Math.random());

const dialogOneProps: Dialogic.Options = {
  component: DefaultContent,
  showDuration: 0.5,
  hideDuration: 0.5,
  className: "xxx",
  showClassName: "xxx-visible",
  title: "Clock",
  id: getRandomNumber().toString(),
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
  id: getRandomNumber().toString(),
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
  id: getRandomNumber().toString(),
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
                  title: dialogOneProps.title + ' ' + getRandomNumber(),
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
                  didShow: (id: string) => console.log("didShow", id),
                  didHide: (id: string) => console.log("didHide", id),
                  showDuration: 0.5,
                  showDelay: 0.25,
                  component: DefaultContent,
                  title: "With Promise"
                },
                {
                  id: "withPromise"
                }
              ).then((id: string) => console.log("dialog shown", id)) 
          },
          "Show with promises"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ id: "withPromise" })
                .then((id: string) => console.log("dialog hidden", id))
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
                  title: dialogThreeProps.title + " " + getRandomNumber()
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
                  title: dialogThreeProps.title + " " + getRandomNumber()
                },
                {
                  id: "timer"
                }
              )    
          },
          "With timeout"
        ),
        m("div", `Is paused: ${dialog.isPaused({ id: "timer" })}`),
        m("div", m(Remaining, { getRemaining: () => dialog.getRemaining({ id: "timer" })})),
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
        m("p", `Dialog in this spawn count: ${dialog.getCount({ spawn: "special" })}`)
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
        m("p", `Dialog in this spawn count: ${dialog.getCount({ spawn: "Q" })}`)
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  title: "Queued " + Math.round(1000 * Math.random()),
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
        m("section", { className: "section"}, [
          m(Dialog, { spawn: "Q" }),
        ]),
      ]),
      
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Notification"),
        m("div", `Notification count: ${notification.getCount()}`),
        m("div", `Is paused: ${notification.isPaused({ spawn: "NO" })}`),
        m("div", m(Remaining, { getRemaining: () => notification.getRemaining({ spawn: "NO" })})),
      ]),
      m("section", { className: "section"}, [
        m("button",
          {
            className: "button",
            onclick: () => {
              const title = "N " + getRandomNumber();
              return notification.show(
                {
                  didShow: (id: string) => console.log("didShow", id, title),
                  didHide: (id: string) => console.log("didHide", id, title),
                  component: DefaultContent,
                  className: "xxx-timings",
                  showClassName: "xxx-visible-timings",
                  title,
                },
                {
                  spawn: "NO"
                }
              ).then((id: string) => console.log("notification shown", id, title))
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
              notification.hide({ spawn: "NO" }).then((id: string) => console.log("notification hidden from App", id))
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
