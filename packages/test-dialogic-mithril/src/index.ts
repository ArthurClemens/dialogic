import m, { RouteDefs } from 'mithril';
import DialogClassName from './cypress-tests/DialogClassName';
import DialogClassNameDelay from './cypress-tests/DialogClassNameDelay';
import DialogStyles from './cypress-tests/DialogStyles';
import DialogIds from './cypress-tests/DialogIds';
import DialogExists from './cypress-tests/DialogExists';
import DialogCount from './cypress-tests/DialogCount';
import DialogHideAll from './cypress-tests/DialogHideAll';
import DialogResetAll from './cypress-tests/DialogResetAll';
import DialogTimeout from './cypress-tests/DialogTimeout';
import DialogQueued from './cypress-tests/DialogQueued';
import NotificationCount from './cypress-tests/NotificationCount';
import NotificationPause from './cypress-tests/NotificationPause';
import NotificationTimeout from './cypress-tests/NotificationTimeout';
import UseRemaining from './cypress-tests/UseRemaining';
import LibBulmaDialog from './cypress-tests/LibBulmaDialog';
import LibMaterialIODialog from './cypress-tests/LibMaterialIODialog';
import { routes as useDialogRoutes } from './cypress-tests/UseDialog';
import { RouteEntry } from './types';

import './app-styles.css';
import './test-styles.css';

const Home = {
  view: () =>
    m(
      '.menu',
      m(
        'ul',
        routes
          .filter(({ showInMenu }) => !!showInMenu)
          .map(({ path }) =>
            m('li', m(m.route.Link, { href: path }, path.substr(1))),
          ),
      ),
    ),
};

const routes: RouteEntry[] = [
  { path: '/', component: Home, showInMenu: true },
  { path: '/DialogClassName', component: DialogClassName, showInMenu: true },
  {
    path: '/DialogClassNameDelay',
    component: DialogClassNameDelay,
    showInMenu: true,
  },
  { path: '/DialogStyles', component: DialogStyles, showInMenu: true },
  { path: '/DialogIds', component: DialogIds, showInMenu: true },
  { path: '/DialogExists', component: DialogExists, showInMenu: true },
  { path: '/DialogCount', component: DialogCount, showInMenu: true },
  { path: '/DialogHideAll', component: DialogHideAll, showInMenu: true },
  { path: '/DialogResetAll', component: DialogResetAll, showInMenu: true },
  { path: '/DialogTimeout', component: DialogTimeout, showInMenu: true },
  { path: '/DialogQueued', component: DialogQueued, showInMenu: true },
  {
    path: '/NotificationCount',
    component: NotificationCount,
    showInMenu: true,
  },
  {
    path: '/NotificationPause',
    component: NotificationPause,
    showInMenu: true,
  },
  {
    path: '/NotificationTimeout',
    component: NotificationTimeout,
    showInMenu: true,
  },
  { path: '/LibBulmaDialog', component: LibBulmaDialog, showInMenu: true },
  {
    path: '/LibMaterialIODialog',
    component: LibMaterialIODialog,
    showInMenu: true,
  },
  {
    path: '/UseRemaining',
    component: UseRemaining,
    showInMenu: true,
  },
  ...useDialogRoutes,
];

m.route.prefix = '#';
const mountNode = document.getElementById('root');
if (mountNode) {
  m.route(
    mountNode,
    '/',
    routes.reduce((acc, entry) => {
      const { path, component } = entry;
      acc[path] = component;
      return acc;
    }, {} as RouteDefs),
  );
}
