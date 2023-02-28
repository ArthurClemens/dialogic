/* eslint-disable import/no-extraneous-dependencies */
import 'demo-dialogic-mithril-router/src/layout.css';

import { HomePage } from 'demo-dialogic-mithril-router/src/pages/HomePage';
import { ProfilePage } from 'demo-dialogic-mithril-router/src/pages/ProfilePage';
import { Dialog, Notification } from 'dialogic-mithril';
import m, { Component } from 'mithril';

import { RouteEntry } from '../types';

const PREFIX = '/UseDialogTest';

type WrapComponent = {
  /**
   * Used for e2e tests.
   */
  pathPrefix?: string;
};

const resolve = (component: Component<WrapComponent>) => ({
  render: () =>
    m('.app', [
      m(component, { pathPrefix: PREFIX }),
      m(Dialog),
      m(Notification),
    ]),
});

export const routes = [
  { path: PREFIX, component: resolve(HomePage), showInMenu: true },
  { path: `${PREFIX}/profile`, component: resolve(ProfilePage) },
  { path: `${PREFIX}/profile/:cmd`, component: resolve(ProfilePage) },
] as RouteEntry[];
