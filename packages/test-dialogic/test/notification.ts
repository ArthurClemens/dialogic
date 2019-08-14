import { notification, showItem, setDomElement } from "dialogic";
import test from "ava";

const getDefaultItemId = (name: string) => `${name}-default_${name}-default_${name}`;

const defaultItemId = getDefaultItemId("notification");

test("show: should resolve when no transition options passed", t => {
  // Can"t use resetAll because this test is async
  const options = {
    title: "Test", // not a transition option
    timeout: undefined
  };
  const spawnOptions = undefined;
  return notification.show(options, spawnOptions)
    .then(item => {
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
  t.is(notification.exists(), true);
});

test("show, getCount: when spawn option `id` is specified, the state should contain multiple items", t => {
  notification.resetAll();
  [1,2,3].forEach(n => notification.show(
    {
      title: n
    },
    {
      id: n.toString()
    }));
  const expected = 3;
  const actual = notification.getCount();
  t.is(actual, expected);
  t.is(notification.exists({ id: "1" }), true);
  t.is(notification.exists({ id: "2" }), true);
  t.is(notification.exists({ id: "3" }), true);
});

test("show, getCount: when spawn option `spawn` is specified, the state should contain multiple items", t => {
  notification.resetAll();
  [1,2,3].forEach(n => notification.show(
    {
      title: n
    },
    {
      spawn: n.toString()
    }));
  const expected = 3;
  const actual = notification.getCount();
  t.is(notification.exists({ spawn: "1" }), true);
  t.is(notification.exists({ spawn: "2" }), true);
  t.is(notification.exists({ spawn: "3" }), true);
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
  return notification.show(options, spawnOptions)
    .then(() => {
      t.is(notification.exists(spawnOptions), true);
      return notification.hide(spawnOptions).then(item => {
        t.is(item.id, "notification-show-hide-default_notification");
        t.is(notification.exists(spawnOptions), false);
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
  return notification.show(options, spawnOptions)
    .then(() => {
      t.is(notification.exists(spawnOptions), true);
      return notification.toggle(options, spawnOptions).then(item => {
        t.is(item.id, "notification-show-toggle-default_notification");
        t.is(notification.exists(spawnOptions), false);
      })
    });
});

test.serial("transitionClassName-x", t => {
	const div = document.createElement("div");
  document.body.appendChild(div);
  div.classList.add("yyy");
  t.is(div.classList.contains("yyy"), true);
  t.is(document.querySelector("div"), div);
  
  const options = {
    title: "Test", // not a transition option
    transitionClassName: "xxx"
  };
  const spawnOptions = {
    id: "dom"
  };
  return notification.show(options, spawnOptions)
    .then(item => {
      t.is(item.id, "notification-dom-default_notification");
      t.is(notification.exists(spawnOptions), true);
      setDomElement(div, item);
      return showItem(item).then(item => {
        t.is(item.id, "notification-dom-default_notification");
        t.is(notification.exists(spawnOptions), true);
        t.is(div.classList.contains("yyy"), true);
        t.is(div.classList.contains("xxx-show-end"), true);
      })
    })
});
