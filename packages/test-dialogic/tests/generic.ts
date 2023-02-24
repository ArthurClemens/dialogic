import { deepStrictEqual } from "assert";
import { dialog, notification } from "dialogic";

const getDefaultItemId = (name: string) =>
  `${name}-default_${name}-default_${name}`;

const targets = [
  {
    type: dialog,
    name: "dialog",
    defaultDialogicOptions: {
      id: "default_dialog",
      spawn: "default_dialog",
    },
    defaultItemId: getDefaultItemId("dialog"),
  },
  {
    type: notification,
    name: "notification",
    defaultDialogicOptions: {
      id: "default_notification",
      spawn: "default_notification",
      queued: true,
      timeout: 3000,
    },
    defaultItemId: getDefaultItemId("notification"),
  },
];

// identifiers

it("identifiers: should have the correct namespace", () => {
  targets.forEach(({ type, name }) => {
    const expected = name;
    const actual = type.ns;
    deepStrictEqual(actual, expected);
  });
});

it("identifiers: should have the correct default id", () => {
  targets.forEach(({ type, name }) => {
    const expected = `default_${name}`;
    const actual = type.defaultId;
    deepStrictEqual(actual, expected);
  });
});

it("identifiers: should have the correct default spawn", () => {
  targets.forEach(({ type, name }) => {
    const expected = `default_${name}`;
    const actual = type.defaultSpawn;
    deepStrictEqual(actual, expected);
  });
});

// configuration

it("configuration: should have the correct default configuration", () => {
  targets.forEach(({ type, defaultDialogicOptions }) => {
    const expected = defaultDialogicOptions;
    const actual = type.defaultDialogicOptions;
    deepStrictEqual(actual, expected);
  });
});
