import m from 'mithril';

import { CurrentPathBadge } from '../components/CurrentPathBadge';

type TProps = {
  /**
   * Used for e2e tests.
   */
  pathPrefix?: string;
};

export const HomePage: m.Component<TProps> = {
  view: ({ attrs }) =>
    m('div', { 'data-test-id': 'home-page' }, [
      m('h1.title', 'Home'),
      m(CurrentPathBadge),
      m(
        'p.intro',
        m.trust(
          "This demo shows the <code>useDialog</code> hook that allows for an imperative way of controlling dialogs. The Profile dialog responds to the route, and is automatically hidden when using the browser's back button.",
        ),
      ),
      m('.buttons', [
        m(
          m.route.Link,
          {
            className: 'button is-link',
            href: `${attrs.pathPrefix || ''}/profile`,
            'data-test-id': 'btn-profile',
          },
          'Go to Profile',
        ),
      ]),
    ]),
};
