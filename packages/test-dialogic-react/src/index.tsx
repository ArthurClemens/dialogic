import './app-styles.css';
import './test-styles.css';

import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Link, Route, Routes } from 'react-router-dom';

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
  isExact?: boolean;
};
type TRoutes = TRoute[];

let routes: TRoutes;

function Home() {
  return (
    <div className='menu'>
      <ul>
        {routes.map(({ path }) => (
          <li key={path}>
            <Link to={path}>{path.substr(1)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {routes.map(
          ({ path: rawPath, component: Component, isExact = true }) => {
            const path = isExact ? rawPath : `${rawPath}/*`;
            return <Route key={path} path={path} element={<Component />} />;
          },
        )}
      </Routes>
    </Router>
  );
}

routes = [
  { path: '/', component: Home },
  { path: '/DialogClassName', component: DialogClassName },
  {
    path: '/DialogClassNameDelay',
    component: DialogClassNameDelay,
    isExact: true,
  },
  { path: '/DialogStyles', component: DialogStyles },
  { path: '/DialogIds', component: DialogIds },
  { path: '/DialogExists', component: DialogExists },
  { path: '/DialogCount', component: DialogCount },
  { path: '/DialogHideAll', component: DialogHideAll },
  { path: '/DialogResetAll', component: DialogResetAll },
  { path: '/DialogTimeout', component: DialogTimeout },
  { path: '/DialogQueued', component: DialogQueued },
  { path: '/NotificationCount', component: NotificationCount },
  { path: '/NotificationPause', component: NotificationPause },
  {
    path: '/NotificationTimeout',
    component: NotificationTimeout,
    isExact: true,
  },
  { path: '/LibBulmaDialog', component: LibBulmaDialog },
  {
    path: '/LibMaterialIODialog',
    component: LibMaterialIODialog,
    isExact: true,
  },
  { path: '/UseRemaining', component: UseRemaining },
  { path: '/UseDialogTest', component: UseDialogTest, isExact: false },
  {
    path: '/UseDialogComponentTest',
    component: UseDialogComponentTest,
    isExact: false,
  },
];

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <App />,
);
