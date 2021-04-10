import test from 'ava';
import { dialog, notification } from 'dialogic';

const getDefaultItemId = (name: string) =>
  `${name}-default_${name}-default_${name}`;

const targets = [
  {
    type: dialog,
    name: 'dialog',
    defaultDialogicOptions: {
      id: 'default_dialog',
      spawn: 'default_dialog',
    },
    defaultItemId: getDefaultItemId('dialog'),
  },
  {
    type: notification,
    name: 'notification',
    defaultDialogicOptions: {
      id: 'default_notification',
      spawn: 'default_notification',
      queued: true,
      timeout: 3000,
    },
    defaultItemId: getDefaultItemId('notification'),
  },
];

// identifiers

test('identifiers: should have the correct namespace', t => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  targets.forEach(({ type, name, defaultDialogicOptions, defaultItemId }) => {
    const expected = name;
    const actual = type.ns;
    t.is(actual, expected);
  });
});

test('identifiers: should have the correct default id', t => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  targets.forEach(({ type, name, defaultDialogicOptions, defaultItemId }) => {
    const expected = `default_${name}`;
    const actual = type.defaultId;
    t.is(actual, expected);
  });
});

test('identifiers: should have the correct default spawn', t => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  targets.forEach(({ type, name, defaultDialogicOptions, defaultItemId }) => {
    const expected = `default_${name}`;
    const actual = type.defaultSpawn;
    t.is(actual, expected);
  });
});

// configuration

test('configuration: should have the correct default configuration', t => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  targets.forEach(({ type, name, defaultDialogicOptions, defaultItemId }) => {
    const expected = defaultDialogicOptions;
    const actual = type.defaultDialogicOptions;
    t.deepEqual(actual, expected);
  });
});
