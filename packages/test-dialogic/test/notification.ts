import { notification, setDomElement, showItem, hideItem } from "dialogic";
import test from "ava";

const getDefaultItemId = (name: string) => `${name}-default_${name}-default_${name}`;

const defaultItemId = getDefaultItemId("notification");

test.serial("show: should resolve when no transition options passed", t => {
  notification.resetAll();
  const options = {
    title: "Test", 
    dialogic: {
      timeout: undefined
    }
  };
  return notification.show(options)
    .then(item => {
      t.is(item.id, defaultItemId);
    });
});

test.serial("getCount: even when no dialogic options are specified, the state should contain multiple (queued) items", t => {
  notification.resetAll();
  const options = {
    title: "Test", 
    dialogic: {
      timeout: undefined
    }
  };
  [1,2,3].forEach(n => notification.show(options));
  t.is(notification.exists(), true);
});

test.serial("getCount: when dialogic option `id` is specified, the state should contain multiple items", t => {
  notification.resetAll();
  [1,2,3].forEach(n => notification.show(
    {
      title: n,
      dialogic: {
        id: n.toString()
      }
    }
  ));
  t.is(notification.exists({ id: "1" }), true);
  t.is(notification.exists({ id: "2" }), true);
  t.is(notification.exists({ id: "3" }), true);
  const expected = 3;
  const actual = notification.getCount();
  t.is(actual, expected);
});

test.serial("getCount: when dialogic option `spawn` is specified, the state should contain multiple items", t => {
  notification.resetAll();
  [1,2,3].forEach(n => notification.show(
    {
      title: n,
      dialogic: {
        spawn: n.toString()
      }
    }
  ));
  t.is(notification.exists({ spawn: "1" }), true);
  t.is(notification.exists({ spawn: "2" }), true);
  t.is(notification.exists({ spawn: "3" }), true);
  const expected = 3;
  const actual = notification.getCount();
  t.is(actual, expected);
});

test.serial("hide: should hide the item", t => {
  notification.resetAll();
  const identityOptions = {
    id: "show-hide"
  }
  const options = {
    dialogic: {
      ...identityOptions,
      timeout: undefined
    }
  };
  return notification.show(options)
    .then(() => {
      t.is(notification.exists(identityOptions), true);
      return notification.hide({
        dialogic: identityOptions
      }).then(item => {
        t.is(item.id, "notification-show-hide-default_notification");
        t.is(notification.exists(identityOptions), false);
      })
    });
});

test.serial("show, toggle: should show and hide the item", t => {
  notification.resetAll();
  const identityOptions = {
    id: "show-toggle"
  }
  const options = {
    dialogic: {
      ...identityOptions,
      timeout: undefined,
      toggle: true
    }
  };
  
  return notification.show(options)
    .then(() => {
      t.is(notification.exists(identityOptions), true);
      return notification.show(options).then(item => {
        t.is(item.id, "notification-show-toggle-default_notification");
        t.is(notification.exists(identityOptions), false);
      })
    });
});

test.serial("transition className", t => {
	const div = document.createElement("div");
  document.body.appendChild(div);
  div.classList.add("yyy");
  t.is(div.classList.contains("yyy"), true);
  t.is(document.querySelector("div"), div);
  
  const identityOptions = {
    id: "dom"
  };
  const options = {
    title: "Test",
    dialogic: {
      ...identityOptions,
      className: "xxx"
    }
  };
  
  return notification.show(options)
    .then(item => {
      t.is(item.id, "notification-dom-default_notification");
      t.is(notification.exists(identityOptions), true);
      setDomElement(div, item);

      return showItem(item).then(item => {
        t.is(item.id, "notification-dom-default_notification");
        t.is(notification.exists(identityOptions), true);
        t.is(div.classList.contains("yyy"), true);
        t.is(div.classList.contains("xxx-show-end"), true);

        return hideItem(item).then(item => {
          t.is(item.id, "notification-dom-default_notification");
          t.is(notification.exists(identityOptions), false);
          t.is(div.classList.contains("yyy"), true);
          t.is(div.classList.contains("xxx-hide-end"), true);
        });
      })
    })
});
