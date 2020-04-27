import React from 'react';
import './styles.css';
import { HomePage } from './HomePage';
import { ProfilePage } from './ProfilePage';

import { Dialog, Notification } from 'dialogic-react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const AppRoutes = () => (
  <Router>
    <Switch>
      <Route path="/profile">
        <ProfilePage />
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
    <Dialog />
    <Notification />
  </Router>
);

export default () => (
  <div className="app">
    <AppRoutes />
  </div>
);
