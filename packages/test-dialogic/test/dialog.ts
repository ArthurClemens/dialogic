import { dialog } from "dialogic";
import test from "ava";

const getDefaultItemId = name => `${name}-default_${name}-default_${name}`;

const defaultItemId = getDefaultItemId("dialog");

test("show: should resolve when no transition options passed", t => {
  // Can't use resetAll because this test is async
  const options = {
    title: "Test", 
    dialogic: {
      timeout: undefined
    }
  };
  return dialog.show(options)
    .then(item => {
      t.is(item.id, defaultItemId);
    });
});

test("show, getCount: when no dialogic options are specified, the state should contain 1 item", t => {
  dialog.resetAll();
  [1,2,3].forEach(n => dialog.show({
    title: n
  }));
  const expected = 1;
  const actual = dialog.getCount();
  t.is(actual, expected);
});

test("show, getCount: when dialogic option `id` is specified, the state should contain multiple items", t => {
  dialog.resetAll();
  [1,2,3].forEach(n => dialog.show(
    {
      title: n,
      dialogic: {
        id: n.toString()
      }
    }));
  const expected = 3;
  const actual = dialog.getCount();
  t.is(actual, expected);
});

test("show, getCount: when dialogic option `spawn` is specified, the state should contain multiple items", t => {
  dialog.resetAll();
  [1,2,3].forEach(n => dialog.show(
    {
      title: n,
      dialogic: {
        spawn: n.toString()
      }
    }));
  const expected = 3;
  const actual = dialog.getCount();
  t.is(actual, expected);
});

test("show, hide: should hide the item", t => {
  // Can't use resetAll because this test is async
  const identityOptions = {
    id: "show-hide"
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout: undefined
    }
  };
  return dialog.show(options)
    .then(() => {
      t.is(dialog.exists(identityOptions), true);
      return dialog.hide(identityOptions).then(item => {
        t.is(item.id, "dialog-show-hide-default_dialog");
        t.is(dialog.exists(identityOptions), false);
      })
    });
});

test("toggle: should show and hide the item", t => {
  // Cant use resetAll because this test is async
  const identityOptions = {
    id: "show-toggle"
  }
  const options = {
    dialogic: {
      ...identityOptions,
      toggle: true
    }
  };
  
  return dialog.show(options)
    .then(() => {
      t.is(dialog.exists(identityOptions), true);
      return dialog.show(options).then(item => {
        t.is(item.id, "dialog-show-toggle-default_dialog");
        t.is(dialog.exists(identityOptions), false);
      })
    });
});
