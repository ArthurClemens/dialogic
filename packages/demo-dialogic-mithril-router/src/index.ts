import m from 'mithril';
import { Dialog } from 'dialogic-mithril';
import { ProfilePage } from './ProfilePage';
import { HomePage } from './HomePage';

import './styles.css';

const App = {
  view: (vnode: m.Vnode) => {
    return m('div', { className: 'app' }, [
      vnode.children,
      m(Dialog),
      // m(Notification),
    ]);
  },
};

const appLayout = (Component: m.Component | m.ClosureComponent) => ({
  view: () => m(App, m(Component)),
});

const AppWithProfilePage = appLayout(ProfilePage);

const rootElement: HTMLElement | null = document.getElementById('root');
if (rootElement) {
  m.route(rootElement, '/', {
    '/': appLayout(HomePage),
    '/profile': AppWithProfilePage,
    '/profile/:cmd': AppWithProfilePage,
  });
}
