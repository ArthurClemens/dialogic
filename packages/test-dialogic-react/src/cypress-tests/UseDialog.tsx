import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomePage } from '../../../demo-dialogic-react-router/src/HomePage';
import { ProfilePage } from '../../../demo-dialogic-react-router/src/ProfilePage';
import '../../../demo-dialogic-react-router/src/styles.css';
import { Dialog, Notification } from 'dialogic-react';
import { useStore } from '../../../demo-dialogic-react-router/src/store';

const PREFIX = '/UseDialogTest';

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
