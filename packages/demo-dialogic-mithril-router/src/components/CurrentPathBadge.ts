import m from 'mithril';

export const CurrentPathBadge = {
  view: () => {
    const route = m.route.get() || '/';
    return m(
      'div.control.path-control',
      m('span.tag', { 'data-test-id': 'current-path' }, route),
    );
  },
};
