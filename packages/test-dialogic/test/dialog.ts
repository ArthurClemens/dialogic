import test from 'ava';
import { dialog, hideItem, showItem } from 'dialogic';

const getDefaultItemId = (name: string) =>
  `${name}-default_${name}-default_${name}`;

const defaultItemId = getDefaultItemId('dialog');

test.serial('show: should resolve when no transition options passed', t => {
  dialog.resetAll();
  const options = {
    title: 'Test',
    dialogic: {
      timeout: undefined,
    },
  };
  return dialog.show(options).then(item => {
    t.is(item.id, defaultItemId);
  });
});

test.serial(
  'getCount: when no dialogic options are specified, the state should contain 1 item',
  t => {
    dialog.resetAll();
    [1, 2, 3].forEach(n =>
      dialog.show({
        title: n,
      }),
    );
    const expected = 1;
    const actual = dialog.getCount();
    t.is(actual, expected);
  },
);

test.serial(
  'getCount: when dialogic option `id` is specified, the state should contain multiple items',
  t => {
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
    t.is(actual, expected);
  },
);

test.serial(
  'getCount: when dialogic option `spawn` is specified, the state should contain multiple items',
  t => {
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
    t.is(actual, expected);
  },
);

test.serial('hide: should hide the item', t => {
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
    t.is(dialog.exists(identityOptions), true);
    return dialog
      .hide({
        dialogic: identityOptions,
      })
      .then(item => {
        t.is(item.id, 'dialog-show-hide-default_dialog');
        t.is(dialog.exists(identityOptions), false);
      });
  });
});

test.serial('toggle: should show and hide the item', t => {
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
    t.is(dialog.exists(identityOptions), true);
    return dialog.show(options).then(item => {
      t.is(item.id, 'dialog-show-toggle-default_dialog');
      t.is(dialog.exists(identityOptions), false);
    });
  });
});

test.serial(
  'resetAll (no dialogic options specified): should remove all',
  t => {
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
      t.is(items.length, 3);
      t.is(dialog.exists(), true);
      t.is(dialog.exists({ id: '1' }), true);
      t.is(dialog.exists({ id: '2', spawn: 'reset-all' }), true);

      return dialog.resetAll().then(() => {
        t.is(dialog.exists(), false);
        t.is(dialog.exists({ id: '1' }), false);
        t.is(dialog.exists({ id: '2', spawn: 'reset-all' }), false);
      });
    });
  },
);

test.serial('resetAll (different spawn specified): should remove some', t => {
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
    t.is(items.length, 4);
    t.is(dialog.exists(), true);
    t.is(dialog.exists({ id: '1' }), true);
    t.is(dialog.exists({ id: '2', spawn: 'reset-all-1' }), true);
    t.is(dialog.exists({ spawn: 'reset-all-2' }), true);

    return dialog.resetAll({ spawn: 'reset-all-1' }).then(() => {
      t.is(dialog.exists(), true);
      t.is(dialog.exists({ id: '1' }), true);
      t.is(dialog.exists({ id: '2', spawn: 'reset-all-1' }), false);
      t.is(dialog.exists({ spawn: 'reset-all-2' }), true);
    });
  });
});

test.serial('hideAll (no dialogic options specified): should hide all', t => {
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
    t.is(items.length, 2);
    t.is(dialog.exists({ id: '1', spawn }), true);
    t.is(dialog.exists({ id: '2', spawn }), true);

    return dialog.hideAll({ spawn }).then(hiddenItems => {
      t.is(hiddenItems.length, 2);
      t.is(dialog.exists({ id: '1', spawn }), false);
      t.is(dialog.exists({ id: '2', spawn }), false);
    });
  });
});

test.serial('hideAll (different spawn specified): should hide some', t => {
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
    t.is(items.length, 2);
    t.is(dialog.exists({ id: '1', spawn: 'hide-all-1' }), true);
    t.is(dialog.exists({ id: '2', spawn: 'hide-all-2' }), true);

    return dialog.hideAll({ spawn: 'hide-all-1' }).then(hiddenItems => {
      t.is(hiddenItems.length, 1);
      t.is(dialog.exists({ id: '1', spawn: 'hide-all-1' }), false);
      t.is(dialog.exists({ id: '2', spawn: 'hide-all-2' }), true);
    });
  });
});

test.serial('callbacks: should call didShow and didHide', t => {
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
    t.is(dialog.exists(identityOptions), true);

    return showItem(item).then(() => {
      t.is(dialog.exists(identityOptions), true);
      t.is(results.didShow, true);

      return hideItem(item).then(() => {
        t.is(dialog.exists(identityOptions), false);
        t.is(results.didHide, true);
      });
    });
  });
});

test.serial('promises: show and hide should return promises', t => {
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
    t.is(item.id, 'dialog-default_dialog-promises');

    return dialog
      .hide({
        dialogic: identityOptions,
      })
      .then(hiddenItem => {
        // t.log("hide promise");
        t.is(hiddenItem.id, 'dialog-default_dialog-promises');
      });
  });
});
