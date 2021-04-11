import './styles.css';

import { Dialog, Notification } from 'dialogic-react';
import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { HomePage } from './HomePage';
import { ProfilePage } from './ProfilePage';
import { useStore } from './store';

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

export default () => (
  <div className="app">
    <AppRoutes />
  </div>
);
