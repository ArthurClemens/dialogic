import m from "mithril";
import DefaultDialog from "./cypress-tests/DefaultDialog";

import "./styles.css";

const App = {
  view: () => 
    m("div", [
      "Test",
      m(m.route.Link, { href: "/DefaultDialog" }, "DefaultDialog")
    ])
};

m.route.prefix = "#";
const mountNode = document.getElementById("root");
const routes = {
  "/": App,
  "/DefaultDialog": DefaultDialog
};
if (mountNode) {
  m.route(mountNode, "/", routes);
}
