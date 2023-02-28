import { deepStrictEqual } from 'assert';
import { hideItem, notification, setDomElement, showItem } from 'dialogic';

const getDefaultItemId = (name: string) =>
  `${name}-default_${name}-default_${name}`;

const defaultItemId = getDefaultItemId('notification');

it('show: should resolve when no transition options passed', () => {
  notification.resetAll();
  const options = {
    title: 'Test',
    dialogic: {
      timeout: undefined,
    },
  };
  return notification.show(options).then(item => {
    deepStrictEqual(item.id, defaultItemId);
  });
});

it('getCount: even when no dialogic options are specified, the state should contain multiple (queued) items', () => {
  notification.resetAll();
  const options = {
    title: 'Test',
    dialogic: {
      timeout: undefined,
    },
  };
  [1, 2, 3].forEach(() => notification.show(options));
  deepStrictEqual(notification.exists(), true);
});

it('getCount: when dialogic option `id` is specified, the state should contain multiple items', () => {
  notification.resetAll();
  [1, 2, 3].forEach(n =>
    notification.show({
      title: n,
      dialogic: {
        id: n.toString(),
      },
    }),
  );
  deepStrictEqual(notification.exists({ id: '1' }), true);
  deepStrictEqual(notification.exists({ id: '2' }), true);
  deepStrictEqual(notification.exists({ id: '3' }), true);
  const expected = 3;
  const actual = notification.getCount();
  deepStrictEqual(actual, expected);
});

it('getCount: when dialogic option `spawn` is specified, the state should contain multiple items', () => {
  notification.resetAll();
  [1, 2, 3].forEach(n =>
    notification.show({
      title: n,
      dialogic: {
        spawn: n.toString(),
      },
    }),
  );
  deepStrictEqual(notification.exists({ spawn: '1' }), true);
  deepStrictEqual(notification.exists({ spawn: '2' }), true);
  deepStrictEqual(notification.exists({ spawn: '3' }), true);
  const expected = 3;
  const actual = notification.getCount();
  deepStrictEqual(actual, expected);
});

it('hide: should hide the item', () => {
  notification.resetAll();
  const identityOptions = {
    id: 'show-hide',
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout: undefined,
    },
  };
  return notification.show(options).then(() => {
    deepStrictEqual(notification.exists(identityOptions), true);
    return notification
      .hide({
        dialogic: identityOptions,
      })
      .then(item => {
        deepStrictEqual(item.id, 'notification-show-hide-default_notification');
        deepStrictEqual(notification.exists(identityOptions), false);
      });
  });
});

it.only('show, toggle: should show and hide the item', () => {
  notification.resetAll();
  const identityOptions = {
    id: 'show-toggle',
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout: undefined,
      toggle: true,
    },
  };

  return notification.show(options).then(() => {
    deepStrictEqual(notification.exists(identityOptions), true);
    return notification.show(options).then(item => {
      deepStrictEqual(item.id, 'notification-show-toggle-default_notification');
      deepStrictEqual(notification.exists(identityOptions), false);
    });
  });
});

it('transition className', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.classList.add('yyy');
  deepStrictEqual(div.classList.contains('yyy'), true);
  deepStrictEqual(document.querySelector('div'), div);

  const identityOptions = {
    id: 'dom',
  };
  const options = {
    title: 'Test',
    dialogic: {
      ...identityOptions,
      className: 'xxx',
    },
  };

  return notification.show(options).then(item => {
    deepStrictEqual(item.id, 'notification-dom-default_notification');
    deepStrictEqual(notification.exists(identityOptions), true);
    setDomElement(div, item);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    return showItem(item).then(shownItem => {
      deepStrictEqual(shownItem.id, 'notification-dom-default_notification');
      deepStrictEqual(notification.exists(identityOptions), true);
      deepStrictEqual(div.classList.contains('yyy'), true);
      deepStrictEqual(div.classList.contains('xxx-show-end'), true);

      return hideItem(item).then(hiddenItem => {
        deepStrictEqual(hiddenItem.id, 'notification-dom-default_notification');
        deepStrictEqual(notification.exists(identityOptions), false);
        deepStrictEqual(div.classList.contains('yyy'), true);
        deepStrictEqual(div.classList.contains('xxx-hide-end'), true);
      });
    });
  });
});
