import m from 'mithril';
import { CurrentPathBadge } from './CurrentPathBadge';

export const HomePage = {
  view: () => {
    return m('div', [
      m('h1.title', 'Home'),
      m(CurrentPathBadge),
      m('.buttons', [
        m(
          m.route.Link,
          { className: 'button is-link', href: '/profile' },
          'Go to Profile',
        ),
      ]),
    ]);
  },
};
