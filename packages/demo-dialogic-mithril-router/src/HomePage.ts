import m from 'mithril';
import { CurrentPathBadge } from './CurrentPathBadge';

type TProps = {
  pathPrefix?: string;
};

export const HomePage: m.Component<TProps> = {
  view: ({ attrs }) => {
    return m('div', { 'data-test-id': 'home-page' }, [
      m('h1.title', 'Home'),
      m(CurrentPathBadge),
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
    ]);
  },
};
