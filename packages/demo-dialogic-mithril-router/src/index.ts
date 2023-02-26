import './dialogic.css';
import './layout.css';

import { Dialog, Notification } from 'dialogic-mithril';
import m from 'mithril';

import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';

type TApp = {
  Component: m.Component;
};

const App = {
  view: ({ attrs }: { attrs: TApp }) => {
    const { Component } = attrs;

    return m('div', { className: 'app' }, [
      Component && m(Component),
      m(Notification),
      m(Dialog),
    ]);
  },
};

const resolve = (Component: m.Component) => ({
  onmatch() {
    return App;
  },
  render() {
    return m(App, { Component });
  },
});

const rootElement: HTMLElement | null = document.getElementById('app');
if (rootElement) {
  m.route(rootElement, '/', {
    '/': resolve(HomePage),
    '/profile': resolve(ProfilePage),
    '/profile/:cmd': resolve(ProfilePage),
  });
}
