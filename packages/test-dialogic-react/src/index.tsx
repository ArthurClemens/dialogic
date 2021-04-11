import './app-styles.css';
import './test-styles.css';

import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';

import DialogClassName from './cypress-tests/DialogClassName';
import DialogClassNameDelay from './cypress-tests/DialogClassNameDelay';
import DialogCount from './cypress-tests/DialogCount';
import DialogExists from './cypress-tests/DialogExists';
import DialogHideAll from './cypress-tests/DialogHideAll';
import DialogIds from './cypress-tests/DialogIds';
import DialogQueued from './cypress-tests/DialogQueued';
import DialogResetAll from './cypress-tests/DialogResetAll';
import DialogStyles from './cypress-tests/DialogStyles';
import DialogTimeout from './cypress-tests/DialogTimeout';
import LibBulmaDialog from './cypress-tests/LibBulmaDialog';
import LibMaterialIODialog from './cypress-tests/LibMaterialIODialog';
import NotificationCount from './cypress-tests/NotificationCount';
import NotificationPause from './cypress-tests/NotificationPause';
import NotificationTimeout from './cypress-tests/NotificationTimeout';
import UseDialogTest from './cypress-tests/UseDialog';
import UseDialogComponentTest from './cypress-tests/UseDialogComponent';
import UseRemaining from './cypress-tests/UseRemaining';

type TRoute = {
  path: string;
  component: FunctionComponent;
  isExact: boolean;
};
type TRoutes = TRoute[];

let routes: TRoutes;

const Home = () => (
  <div className="menu">
    <ul>
      {routes.map(({ path }) => (
        <li key={path}>
          <Link to={path}>{path.substr(1)}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const App = () => (
  <Router>
    <Switch>
      {routes.map(({ path, component, isExact }) => (
        <Route key={path} path={path} exact={isExact} component={component} />
      ))}
    </Switch>
  </Router>
);

routes = [
  { path: '/', component: Home, isExact: true },
  { path: '/DialogClassName', component: DialogClassName, isExact: true },
  {
    path: '/DialogClassNameDelay',
    component: DialogClassNameDelay,
    isExact: true,
  },
  { path: '/DialogStyles', component: DialogStyles, isExact: true },
  { path: '/DialogIds', component: DialogIds, isExact: true },
  { path: '/DialogExists', component: DialogExists, isExact: true },
  { path: '/DialogCount', component: DialogCount, isExact: true },
  { path: '/DialogHideAll', component: DialogHideAll, isExact: true },
  { path: '/DialogResetAll', component: DialogResetAll, isExact: true },
  { path: '/DialogTimeout', component: DialogTimeout, isExact: true },
  { path: '/DialogQueued', component: DialogQueued, isExact: true },
  { path: '/NotificationCount', component: NotificationCount, isExact: true },
  { path: '/NotificationPause', component: NotificationPause, isExact: true },
  {
    path: '/NotificationTimeout',
    component: NotificationTimeout,
    isExact: true,
  },
  { path: '/LibBulmaDialog', component: LibBulmaDialog, isExact: true },
  {
    path: '/LibMaterialIODialog',
    component: LibMaterialIODialog,
    isExact: true,
  },
  { path: '/UseRemaining', component: UseRemaining, isExact: true },
  { path: '/UseDialogTest', component: UseDialogTest, isExact: false },
  {
    path: '/UseDialogComponentTest',
    component: UseDialogComponentTest,
    isExact: false,
  },
];

const mountNode = document.querySelector('#root');
ReactDOM.render(<App />, mountNode);
