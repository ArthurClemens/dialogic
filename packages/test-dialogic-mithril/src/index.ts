import m from "mithril";
import DialogClassName from "./cypress-tests/DialogClassName";
import DialogClassNameDelay from "./cypress-tests/DialogClassNameDelay";
import DialogStyles from "./cypress-tests/DialogStyles";

import "./app-styles.css";
import "./test-styles.css";

const App = {
  view: () => 
    m(".menu", 
      m("ul", 
        Object.keys(routes).map(path =>
          m("li", 
            m(m.route.Link, { href: path }, path.substr(1))
          )
        )
      )
    )
};

const routes = {
  "/": App,
  "/DialogClassName": DialogClassName,
  "/DialogClassNameDelay": DialogClassNameDelay,
  "/DialogStyles": DialogStyles,
};

m.route.prefix = "#";
const mountNode = document.getElementById("root");
if (mountNode) {
  m.route(mountNode, "/", routes);
}
