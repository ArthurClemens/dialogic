import { Dialog, Notification } from "dialogic-react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import "../../../demo-dialogic-react-router/src/dialogic.css";
import "../../../demo-dialogic-react-router/src/layout.css";
import { HomePage } from "../../../demo-dialogic-react-router/src/pages/HomePage";
import { ProfilePage } from "../../../demo-dialogic-react-router/src/pages/ProfilePage";
import { useStore } from "../../../demo-dialogic-react-router/src/store";

const PREFIX = "/UseDialogTest";

export default () => {
  const store = useStore();
  return (
    <div className="app">
      <Switch>
        <Route path={`${PREFIX}/profile`}>
          <ProfilePage pathPrefix={PREFIX} store={store} />
        </Route>
        <Route path={PREFIX}>
          <HomePage pathPrefix={PREFIX} />
        </Route>
      </Switch>
      <Dialog />
      <Notification />
    </div>
  );
};
