import { notification } from "dialogic";
import test from "ava";

const getDefaultItemId = name => `${name}-default_${name}-default_${name}`;

const defaultItemId = getDefaultItemId("notification");

test("show: should resolve when no transition options passed", t => {
  // Can"t use resetAll because this test is async
  const options = {
    title: "Test", // not a transition option
    timeout: undefined
  };
  const spawnOptions = undefined;
  const showPromise = notification.show(options, spawnOptions);
  return showPromise.then(item => {
    t.is(item.id, defaultItemId);
  });
});

test("show, getCount: even when no spawn options are specified, the state should contain multiple (queued) items", t => {
  // Can"t use resetAll because this test is async
  const options = {
    title: "Test", // not a transition option
    timeout: undefined
  };
  const spawnOptions = undefined;
  [1,2,3].forEach(n => notification.show(options, spawnOptions));
  t.is(notification.isDisplayed(), true);
});

test("show, getCount: when spawn option `id` is specified, the state should contain multiple items", t => {
  notification.resetAll();
  [1,2,3].forEach(n => notification.show(
    {
      title: n
    },
    {
      id: n
    }));
  const expected = 3;
  const actual = notification.getCount();
  t.is(actual, expected);
  t.is(notification.isDisplayed({ id: 1 }), true);
  t.is(notification.isDisplayed({ id: 2 }), true);
  t.is(notification.isDisplayed({ id: 3 }), true);
});

test("show, getCount: when spawn option `spawn` is specified, the state should contain multiple items", t => {
  notification.resetAll();
  [1,2,3].forEach(n => notification.show(
    {
      title: n
    },
    {
      spawn: n
    }));
  const expected = 3;
  const actual = notification.getCount();
  t.is(notification.isDisplayed({ spawn: 1 }), true);
  t.is(notification.isDisplayed({ spawn: 2 }), true);
  t.is(notification.isDisplayed({ spawn: 3 }), true);
  t.is(actual, expected);
});

test("show, hide: should hide the item", t => {
  // Can"t use resetAll because this test is async
  const options = {
    timeout: undefined
  };
  const spawnOptions = {
    id: "show-hide"
  }
  const showPromise = notification.show(options, spawnOptions);
  return showPromise.then(() => {
    t.is(notification.isDisplayed(spawnOptions), true);
    return notification.hide(spawnOptions).then(item => {
      t.is(item.id, "notification-show-hide-default_notification");
      t.is(notification.isDisplayed(spawnOptions), false);
    })
  });
});

test("show, toggle: should hide the item", t => {
  // Can"t use resetAll because this test is async
  const options = {
    timeout: undefined
  };
  const spawnOptions = {
    id: "show-toggle"
  }
  const showPromise = notification.show(options, spawnOptions);
  return showPromise.then(() => {
    t.is(notification.isDisplayed(spawnOptions), true);
    return notification.toggle(options, spawnOptions).then(item => {
      t.is(item.id, "notification-show-toggle-default_notification");
      t.is(notification.isDisplayed(spawnOptions), false);
    })
  });
});

