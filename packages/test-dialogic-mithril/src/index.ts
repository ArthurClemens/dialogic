import m from "mithril";
import DialogClassName from "./cypress-tests/DialogClassName";
import DialogClassNameDelay from "./cypress-tests/DialogClassNameDelay";
import DialogStyles from "./cypress-tests/DialogStyles";
import DialogIds from "./cypress-tests/DialogIds";
import DialogExists from "./cypress-tests/DialogExists";
import DialogCount from "./cypress-tests/DialogCount";
import DialogHideAll from "./cypress-tests/DialogHideAll";
import DialogResetAll from "./cypress-tests/DialogResetAll";
import DialogTimeout from "./cypress-tests/DialogTimeout";
import DialogQueued from "./cypress-tests/DialogQueued";
import NotificationCount from "./cypress-tests/NotificationCount";
import NotificationPause from "./cypress-tests/NotificationPause";
import NotificationTimeout from "./cypress-tests/NotificationTimeout";
import LibBulmaDialog from "./cypress-tests/LibBulmaDialog";
import LibMaterialIODialog from "./cypress-tests/LibMaterialIODialog";

import "./app-styles.css";
import "./test-styles.css";

const Home = {
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
  "/": Home,
  "/DialogClassName": DialogClassName,
  "/DialogClassNameDelay": DialogClassNameDelay,
  "/DialogStyles": DialogStyles,
  "/DialogIds": DialogIds,
  "/DialogExists": DialogExists,
  "/DialogCount": DialogCount,
  "/DialogHideAll": DialogHideAll,
  "/DialogResetAll": DialogResetAll,
  "/DialogTimeout": DialogTimeout,
  "/DialogQueued": DialogQueued,
  "/NotificationCount": NotificationCount,
  "/NotificationPause": NotificationPause,
  "/NotificationTimeout": NotificationTimeout,
  "/LibBulmaDialog": LibBulmaDialog,
  "/LibMaterialIODialog": LibMaterialIODialog,
};

m.route.prefix = "#";
const mountNode = document.getElementById("root");
if (mountNode) {
  m.route(mountNode, "/", routes);
}
