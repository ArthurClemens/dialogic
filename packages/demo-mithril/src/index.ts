// import { dialog, states, selectors } from "dialogic";
import m from "mithril";
import { Dialogic } from "dialogic";
import { dialog, Dialog, notification, Notification } from "./dialogic-mithril";
import { Content as DefaultContent } from "./default/Content";

import "./styles.css";

const getRandomNumber = () => Math.round(1000 * Math.random());

const dialogOneProps: Dialogic.Options = {
  showDuration: 0.5,
  hideDuration: 0.5,
  component: DefaultContent,
  className: "xxx",
  showClassName: "xxx-visible",
  title: "Clock",
  id: getRandomNumber(),
};

// const dialogTwoProps = {
//   showDuration: 0.75,
//   showDelay: 0,
//   hideDuration: 0.75,
//   hideDelay: 0,
//   component: DefaultContent,
//   className: "xxx",
//   showClassName: "xxx-visible",
//   title: "Fade",
//   id: getRandomNumber(),
// };

const dialogThreeProps: Dialogic.Options = {
  showDuration: 0.75,
  showDelay: 0.25,
  hideDuration: 0.75,
  hideDelay: .25,
  component: DefaultContent,
  className: "xxx",
  showClassName: "xxx-visible",
  title: "Delay",
  id: getRandomNumber(),
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
  id: getRandomNumber(),
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
          m("p", `Dialog count: ${dialog.getCount()}`)
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
                  didShow: id => console.log("didShow", id),
                  didHide: id => console.log("didHide", id),
                  showDuration: 0.5,
                  showDelay: 0.25,
                  component: DefaultContent,
                  title: "With Promise"
                },
                {
                  id: "withPromise"
                }
              ).then(id => console.log("dialog shown", id)) 
          },
          "Show with promises"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.hide({ id: "withPromise" })
                .then(id => console.log("dialog hidden", id))
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
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  title: "Queued " + Math.round(1000 * Math.random()),
                  component: DefaultContent,
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
          m("div",
            m("p", `Dialog in this spawn count: ${dialog.getCount()}`)
          ),
        ]),
        m("section", { className: "section"}, [
          m(Dialog, { spawn: "Q" }),
        ]),
      ]),
      m("section", { className: "section"}, [
        m(Dialog),
      ]),
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Dialog with spawn"),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  title: "Custom spawn",
                  component: DefaultContent
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
      
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Notification"),
        m("button",
          {
            className: "button",
            onclick: () => {
              const title = "N " + getRandomNumber();
              return notification.show(
                {
                  didShow: id => console.log("didShow", id, title),
                  didHide: id => console.log("didHide", id, title),
                  component: DefaultContent,
                  className: "xxx-timings",
                  showClassName: "xxx-visible-timings",
                  title,
                },
                {
                  spawn: "NO"
                }
              ).then(id => console.log("notification shown", id, title))
            } 
          },
          "Show notification"
        ),
        m("button",
          {
            className: "button",
            onclick: () =>
              notification.hide({ spawn: "NO" }).then(id => console.log("notification hidden from App", id))
          },
          "Hide"
        ),
        m("div",
          m("p", `Notification count: ${notification.getCount()}`)
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
