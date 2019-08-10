import { dialog } from "dialogic";
import test from "ava";

const getDefaultItemId = name => `${name}-default_${name}-default_${name}`;

const defaultItemId = getDefaultItemId("dialog");

test("show: should resolve when no transition options passed", t => {
  // Can't use resetAll because this test is async
  const options = {
    title: "Test", // not a transition option
    timeout: undefined
  };
  const spawnOptions = undefined;
  const showPromise = dialog.show(options, spawnOptions);
  return showPromise.then(item => {
    t.is(item.id, defaultItemId);
  });
});

test("show, getCount: when no spawn options are specified, the state should contain 1 item", t => {
  dialog.resetAll();
  [1,2,3].forEach(n => dialog.show({
    title: n
  }));
  const expected = 1;
  const actual = dialog.getCount();
  t.is(actual, expected);
});

test("show, getCount: when spawn option `id` is specified, the state should contain multiple items", t => {
  dialog.resetAll();
  [1,2,3].forEach(n => dialog.show(
    {
      title: n
    },
    {
      id: n
    }));
  const expected = 3;
  const actual = dialog.getCount();
  t.is(actual, expected);
});

test("show, getCount: when spawn option `spawn` is specified, the state should contain multiple items", t => {
  dialog.resetAll();
  [1,2,3].forEach(n => dialog.show(
    {
      title: n
    },
    {
      spawn: n
    }));
  const expected = 3;
  const actual = dialog.getCount();
  t.is(actual, expected);
});

test("show, hide: should hide the item", t => {
  // Can't use resetAll because this test is async
  const options = {
    timeout: undefined
  };
  const spawnOptions = {
    id: "show-hide"
  }
  const showPromise = dialog.show(options, spawnOptions);
  return showPromise.then(() => {
    t.is(dialog.isDisplayed(spawnOptions), true);
    return dialog.hide(spawnOptions).then(item => {
      t.is(item.id, "dialog-show-hide-default_dialog");
      t.is(dialog.isDisplayed(spawnOptions), false);
    })
  });
});
