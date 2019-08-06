// import { dialog, states, selectors } from "dialogic";
import m from "mithril";
import { Dialogic } from "dialogic";
import { dialog, Dialog, notification, Notification } from "./dialogic-mithril";
import { Content as DefaultContent } from "./default/Content";

import "./styles.css";

const getRandomNumber = () => Math.round(1000 * Math.random());

const dialogOneProps: Dialogic.Options = {
  showDuration: 0.5,
  showDelay: 0.25,
  hideDuration: 0.5,
  hideDelay: .25,
  component: DefaultContent,
  className: "xxx",
  showClassName: "xxx-visible",
  title: "Clock"
};

const App = {
  view: () => 
    m(".demo", [
      m("section", { className: "section"}, [
        m("h2", { className: "title is-2"}, "Dialog"),
        m("button",
          {
            className: "button",
            onclick: () =>
              dialog.show(
                {
                  ...dialogOneProps,
                  showDelay: .5,
                  hideDelay: 0,
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
        m("div",
          m("p", `Dialog count: ${dialog.getCount()}`)
        ),
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
