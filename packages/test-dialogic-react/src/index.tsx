import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import DialogClassName from "./cypress-tests/DialogClassName";
import DialogClassNameDelay from "./cypress-tests/DialogClassNameDelay";
import DialogStyles from "./cypress-tests/DialogStyles";
import DialogIds from "./cypress-tests/DialogIds";

import "./app-styles.css";
import "./test-styles.css";

const Index = () => (
  <div className="menu">
    <ul>
      {Object.keys(routes).map(path =>
        <li key={path}>
          <Link to={path}>{path.substr(1)}</Link>
        </li>
      )} 
    </ul>
  </div>
);

const App = () => (
  <Router>
    <Switch>
      {Object.keys(routes).map(path =>
        <Route key={path} path={path} exact component={routes[path]} />
      )}
    </Switch>
  </Router>
);

type TRoutes = {
  [key:string]: FunctionComponent;
};

const routes: TRoutes = {
  "/": Index,
  "/DialogClassName": DialogClassName,
  "/DialogClassNameDelay": DialogClassNameDelay,
  "/DialogStyles": DialogStyles,
  "/DialogIds": DialogIds,
  // "/DialogCount": DialogCount,
  // "/DialogHideAll": DialogHideAll,
  // "/DialogResetAll": DialogResetAll,
  // "/DialogTimeout": DialogTimeout,
  // "/DialogQueued": DialogQueued,
  // "/NotificationCount": NotificationCount,
  // "/NotificationPause": NotificationPause,
  // "/NotificationTimeout": NotificationTimeout,
  // "/LibBulmaDialog": LibBulmaDialog,
  // "/LibMaterialIODialog": LibMaterialIODialog,
};

const mountNode = document.querySelector("#root");
ReactDOM.render(<App />, mountNode);