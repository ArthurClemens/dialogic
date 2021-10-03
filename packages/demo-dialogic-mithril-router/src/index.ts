import { Dialog, Notification } from "dialogic-mithril";
import m from "mithril";
import "./dialogic.css";
import "./layout.css";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";

type TApp = {
  Component: m.Component;
};

const App = {
  view: ({ attrs }: { attrs: TApp }) => {
    const { Component } = attrs;

    return m("div", { className: "app" }, [
      Component && m(Component),
      m(Notification),
      m(Dialog),
    ]);
  },
};

const resolve = (Component: m.Component) => ({
  onmatch: function () {
    return App;
  },
  render: function () {
    return m(App, { Component });
  },
});

const rootElement: HTMLElement | null = document.getElementById("app");
if (rootElement) {
  m.route(rootElement, "/", {
    "/": resolve(HomePage),
    "/profile": resolve(ProfilePage),
    "/profile/:cmd": resolve(ProfilePage),
  });
}
