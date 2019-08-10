import { dialog, notification } from "dialogic";
import test from "ava";

const getDefaultItemId = name => `${name}-default_${name}-default_${name}`;

const targets = [
  {
    type: dialog,
    name: "dialog",
    defaultSpawnOptions: {
      id: "default_dialog",
      spawn: "default_dialog",
    },
    defaultItemId: getDefaultItemId("dialog"),
  },
  {
    type: notification,
    name: "notification",
    defaultSpawnOptions: {
      id: "default_notification",
      spawn: "default_notification",
      queued: true,
    },
    defaultItemId: getDefaultItemId("notification"),
  }
];

// identifiers

test("identifiers: should have the correct namespace", t => {
  targets.forEach(({ type, name, defaultSpawnOptions, defaultItemId }) => {
    const expected = name;
    const actual = type.ns;
    t.is(actual, expected);
  })
});

test("identifiers: should have the correct default id", t => {
  targets.forEach(({ type, name, defaultSpawnOptions, defaultItemId }) => {
    const expected = `default_${name}`;
    const actual = type.defaultId;
    t.is(actual, expected);
  });
});

test("identifiers: should have the correct default spawn", t => {
  targets.forEach(({ type, name, defaultSpawnOptions, defaultItemId }) => {
    const expected = `default_${name}`;
    const actual = type.defaultSpawn;
    t.is(actual, expected);
  });
});

// configuration

test("configuration: should have the correct default configuration", t => {
  targets.forEach(({ type, name, defaultSpawnOptions, defaultItemId }) => {
    const expected = defaultSpawnOptions;
    const actual = type.defaultSpawnOptions;
    t.deepEqual(actual, expected);
  });
});
