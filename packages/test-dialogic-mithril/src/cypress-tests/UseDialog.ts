import m, { Component } from 'mithril';
import { HomePage } from '../../../demo-dialogic-mithril-router/src/HomePage';
import { ProfilePage } from '../../../demo-dialogic-mithril-router/src/ProfilePage';
import '../../../demo-dialogic-mithril-router/src/styles.css';
import { Dialog, Notification } from 'dialogic-mithril';
import { RouteEntry } from '../types';

const PREFIX = '/UseDialogTest';

type WrapComponent = {
  pathPrefix?: string;
};

const resolve = (component: Component<WrapComponent>) => ({
  render: () => {
    return m('.app', [
      m(component, { pathPrefix: PREFIX }),
      m(Dialog),
      m(Notification),
    ]);
  },
});

export const routes = [
  { path: PREFIX, component: resolve(HomePage), showInMenu: true },
  { path: `${PREFIX}/profile`, component: resolve(ProfilePage) },
  { path: `${PREFIX}/profile/:cmd`, component: resolve(ProfilePage) },
] as RouteEntry[];
