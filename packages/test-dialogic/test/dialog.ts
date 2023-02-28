import { deepStrictEqual } from 'assert';
import { dialog, hideItem, showItem } from 'dialogic';

const getDefaultItemId = (name: string) =>
  `${name}-default_${name}-default_${name}`;

const defaultItemId = getDefaultItemId('dialog');

it('show: should resolve when no transition options passed', () => {
  dialog.resetAll();
  const options = {
    title: 'Test',
    dialogic: {
      timeout: undefined,
    },
  };
  return dialog.show(options).then(item => {
    deepStrictEqual(item.id, defaultItemId);
  });
});

it('getCount: when no dialogic options are specified, the state should contain 1 item', () => {
  dialog.resetAll();
  [1, 2, 3].forEach(n =>
    dialog.show({
      title: n,
    }),
  );
  const expected = 1;
  const actual = dialog.getCount();
  deepStrictEqual(actual, expected);
});

it('getCount: when dialogic option `id` is specified, the state should contain multiple items', () => {
  dialog.resetAll();
  [1, 2, 3].forEach(n =>
    dialog.show({
      title: n,
      dialogic: {
        id: n.toString(),
      },
    }),
  );
  const expected = 3;
  const actual = dialog.getCount();
  deepStrictEqual(actual, expected);
});

it('getCount: when dialogic option `spawn` is specified, the state should contain multiple items', () => {
  dialog.resetAll();
  [1, 2, 3].forEach(n =>
    dialog.show({
      title: n,
      dialogic: {
        spawn: n.toString(),
      },
    }),
  );
  const expected = 3;
  const actual = dialog.getCount();
  deepStrictEqual(actual, expected);
});

it('hide: should hide the item', () => {
  dialog.resetAll();
  const identityOptions = {
    id: 'show-hide',
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout: undefined,
    },
  };
  return dialog.show(options).then(() => {
    deepStrictEqual(dialog.exists(identityOptions), true);
    return dialog
      .hide({
        dialogic: identityOptions,
      })
      .then(item => {
        deepStrictEqual(item.id, 'dialog-show-hide-default_dialog');
        deepStrictEqual(dialog.exists(identityOptions), false);
      });
  });
});

it('toggle: should show and hide the item', () => {
  dialog.resetAll();
  const identityOptions = {
    id: 'show-toggle',
  };
  const options = {
    dialogic: {
      ...identityOptions,
      toggle: true,
    },
  };

  return dialog.show(options).then(() => {
    deepStrictEqual(dialog.exists(identityOptions), true);
    return dialog.show(options).then(item => {
      deepStrictEqual(item.id, 'dialog-show-toggle-default_dialog');
      deepStrictEqual(dialog.exists(identityOptions), false);
    });
  });
});

it('resetAll (no dialogic options specified): should remove all', () => {
  dialog.resetAll();
  const createDialog = (identityOptions?: {}) => {
    const options = {
      dialogic: identityOptions,
    };
    return dialog.show(options);
  };

  return Promise.all([
    createDialog(),
    createDialog({ id: '1' }),
    createDialog({ id: '2', spawn: 'reset-all' }),
  ]).then(items => {
    deepStrictEqual(items.length, 3);
    deepStrictEqual(dialog.exists(), true);
    deepStrictEqual(dialog.exists({ id: '1' }), true);
    deepStrictEqual(dialog.exists({ id: '2', spawn: 'reset-all' }), true);

    return dialog.resetAll().then(() => {
      deepStrictEqual(dialog.exists(), false);
      deepStrictEqual(dialog.exists({ id: '1' }), false);
      deepStrictEqual(dialog.exists({ id: '2', spawn: 'reset-all' }), false);
    });
  });
});

it('resetAll (different spawn specified): should remove some', () => {
  dialog.resetAll();
  const createDialog = (identityOptions?: {}) => {
    const options = {
      dialogic: identityOptions,
    };
    return dialog.show(options);
  };

  return Promise.all([
    createDialog(),
    createDialog({ id: '1' }),
    createDialog({ id: '2', spawn: 'reset-all-1' }),
    createDialog({ spawn: 'reset-all-2' }),
  ]).then(items => {
    deepStrictEqual(items.length, 4);
    deepStrictEqual(dialog.exists(), true);
    deepStrictEqual(dialog.exists({ id: '1' }), true);
    deepStrictEqual(dialog.exists({ id: '2', spawn: 'reset-all-1' }), true);
    deepStrictEqual(dialog.exists({ spawn: 'reset-all-2' }), true);

    return dialog.resetAll({ spawn: 'reset-all-1' }).then(() => {
      deepStrictEqual(dialog.exists(), true);
      deepStrictEqual(dialog.exists({ id: '1' }), true);
      deepStrictEqual(dialog.exists({ id: '2', spawn: 'reset-all-1' }), false);
      deepStrictEqual(dialog.exists({ spawn: 'reset-all-2' }), true);
    });
  });
});

it('hideAll (no dialogic options specified): should hide all', () => {
  dialog.resetAll();
  const spawn = 'hide-all';
  const createDialog = (id: string) => {
    const options = {
      dialogic: {
        id,
        spawn,
      },
    };
    return dialog.show(options);
  };

  return Promise.all([createDialog('1'), createDialog('2')]).then(items => {
    deepStrictEqual(items.length, 2);
    deepStrictEqual(dialog.exists({ id: '1', spawn }), true);
    deepStrictEqual(dialog.exists({ id: '2', spawn }), true);

    return dialog.hideAll({ spawn }).then(hiddenItems => {
      deepStrictEqual(hiddenItems.length, 2);
      deepStrictEqual(dialog.exists({ id: '1', spawn }), false);
      deepStrictEqual(dialog.exists({ id: '2', spawn }), false);
    });
  });
});

it('hideAll (different spawn specified): should hide some', () => {
  dialog.resetAll();
  const createDialog = (id: string) => {
    const options = {
      dialogic: {
        id,
        spawn: `hide-all-${id}`,
      },
    };
    return dialog.show(options);
  };

  return Promise.all([createDialog('1'), createDialog('2')]).then(items => {
    deepStrictEqual(items.length, 2);
    deepStrictEqual(dialog.exists({ id: '1', spawn: 'hide-all-1' }), true);
    deepStrictEqual(dialog.exists({ id: '2', spawn: 'hide-all-2' }), true);

    return dialog.hideAll({ spawn: 'hide-all-1' }).then(hiddenItems => {
      deepStrictEqual(hiddenItems.length, 1);
      deepStrictEqual(dialog.exists({ id: '1', spawn: 'hide-all-1' }), false);
      deepStrictEqual(dialog.exists({ id: '2', spawn: 'hide-all-2' }), true);
    });
  });
});

it('callbacks: should call didShow and didHide', () => {
  dialog.resetAll();

  const results = {
    didShow: false,
    didHide: false,
  };

  const identityOptions = {
    id: 'callbacks',
  };
  const options = {
    dialogic: {
      ...identityOptions,
      didShow: () => {
        // t.log("didShow"),
        results.didShow = true;
      },
      didHide: () => {
        // t.log("didHide"),
        results.didHide = true;
      },
    },
  };
  return dialog.show(options).then(item => {
    deepStrictEqual(dialog.exists(identityOptions), true);

    return showItem(item).then(() => {
      deepStrictEqual(dialog.exists(identityOptions), true);
      deepStrictEqual(results.didShow, true);

      return hideItem(item).then(() => {
        deepStrictEqual(dialog.exists(identityOptions), false);
        deepStrictEqual(results.didHide, true);
      });
    });
  });
});

it('promises: show and hide should return promises', () => {
  dialog.resetAll();
  const identityOptions = {
    spawn: 'promises',
  };
  const options = {
    dialogic: {
      ...identityOptions,
    },
  };
  return dialog.show(options).then(item => {
    // t.log("show promise");
    deepStrictEqual(item.id, 'dialog-default_dialog-promises');

    return dialog
      .hide({
        dialogic: identityOptions,
      })
      .then(hiddenItem => {
        // t.log("hide promise");
        deepStrictEqual(hiddenItem.id, 'dialog-default_dialog-promises');
      });
  });
});
