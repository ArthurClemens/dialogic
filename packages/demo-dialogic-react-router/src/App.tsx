import React from 'react';
import './styles.css';
import { HomePage } from './HomePage';
import { ProfilePage } from './ProfilePage';
import { useStore } from './store';

import { Dialog, Notification } from 'dialogic-react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

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
      <Dialog />
      <Notification />
    </Router>
  );
};

export default () => {
  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
};
