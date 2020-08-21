import m from 'mithril';
import { Dialog, Notification } from 'dialogic-mithril';
import { ProfilePage } from './ProfilePage';
import { HomePage } from './HomePage';

import './styles.css';

type TApp = {
  Component: m.Component;
};

const App = {
  view: ({ attrs }: { attrs: TApp }) => {
    const { Component } = attrs;

    return m('div', { className: 'app' }, [
      Component && m(Component),
      m(Dialog),
      m(Notification),
    ]);
  },
};

const resolve = (Component: m.Component) => ({
  onmatch: function () {
    return App;
  },
  render: function () {
    return m(App, { Component });
  },
});

const rootElement: HTMLElement | null = document.getElementById('root');
if (rootElement) {
  m.route(rootElement, '/', {
    '/': resolve(HomePage),
    '/profile': resolve(ProfilePage),
    '/profile/:cmd': resolve(ProfilePage),
  });
}
