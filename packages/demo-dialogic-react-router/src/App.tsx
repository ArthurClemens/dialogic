import { Dialog, Notification } from "dialogic-react";
import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./dialogic.css";
import "./layout.css";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { useStore } from "./store";

const AppRoutes = () => {
  const store = useStore();

  return (
    <Router>
      <Switch>
        <Route path="/profile">
          <ProfilePage store={store} />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      <Notification />
      <Dialog />
    </Router>
  );
};

export default () => (
  <div className="app">
    <AppRoutes />
  </div>
);
