import { Dialog, Notification } from 'dialogic-react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomePage } from '../../../demo-dialogic-react-router/src/HomePage';
import { ProfilePage } from '../../../demo-dialogic-react-router/src/ProfilePage';
import { useStore } from '../../../demo-dialogic-react-router/src/store';
import '../../../demo-dialogic-react-router/src/styles.css';

const PREFIX = '/UseDialogComponentTest';

export default () => {
  const store = useStore();
  return (
    <div className="app">
      <Switch>
        <Route path={`${PREFIX}/profile`}>
          <ProfilePage pathPrefix={PREFIX} useDialogComponent store={store} />
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
