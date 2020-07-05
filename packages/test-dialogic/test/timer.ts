import { dialog, notification, showItem } from 'dialogic';
import test from 'ava';

test.serial('notification timeout: should hide after specified time', t => {
  notification.resetAll();
  const timeout = 300;
  const identityOptions = {
    id: 'timeout',
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout,
    },
  };
  return notification.show(options).then(item => {
    t.is(notification.exists(identityOptions), true);

    return showItem(item).then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          t.is(notification.exists(identityOptions), false);
          resolve();
        }, timeout + 100);
      });
    });
  });
});

test.serial('dialog timeout: should hide after specified time', t => {
  dialog.resetAll();
  const timeout = 300;
  const identityOptions = {
    id: 'timeout',
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout,
    },
  };
  return dialog.show(options).then(item => {
    t.is(dialog.exists(identityOptions), true);

    return showItem(item).then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          t.is(dialog.exists(identityOptions), false);
          resolve();
        }, timeout + 100);
      });
    });
  });
});

test.serial('pause and resume, with isPaused and minimumDuration', t => {
  notification.resetAll();
  const timeout = 300;
  const identityOptions = {
    id: 'pause-resume',
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout,
    },
  };
  return notification.show(options).then(item => {
    t.is(notification.exists(identityOptions), true);

    return showItem(item).then(() => {
      let remaining1;

      return new Promise(resolve => {
        setTimeout(() => {
          notification.pause(identityOptions);
          t.is(notification.isPaused(identityOptions), true);

          remaining1 = notification.getRemaining(identityOptions);
          // t.log(`remaining1: ${remaining1}`);
          t.is(remaining1 <= timeout, true);
          t.is(remaining1 > 0, true);
          notification.resume(identityOptions);
          t.is(notification.isPaused(identityOptions), false);

          setTimeout(() => {
            notification.pause(identityOptions);
            const remaining2 = notification.getRemaining(identityOptions);
            // t.log(`remaining2: ${remaining2}`);
            t.is(remaining2 <= timeout, true);
            t.is(remaining2 > 0, true);
            t.is(remaining2 < remaining1, true);

            notification.resume({
              ...identityOptions,
              minimumDuration: timeout,
            });
            notification.pause(identityOptions);
            const remaining3 = notification.getRemaining(identityOptions);
            // t.log(`remaining3: ${remaining3}`);
            t.is(remaining3 <= timeout, true);
            t.is(remaining3 > 0, true);
            t.is(remaining3 > remaining2, true);

            notification.resume(identityOptions);
            t.is(notification.isPaused(identityOptions), false);

            setTimeout(() => {
              const remaining4 = notification.getRemaining(identityOptions);
              // t.log(`remaining4: ${remaining4}`);
              t.is(remaining4 === undefined, true);
              t.is(notification.exists(identityOptions), false);

              resolve();
            }, timeout + 10);
          }, 50);
        }, 50);
      });
    });
  });
});

test.serial('notification stop: should stop the timer', t => {
  notification.resetAll();
  const timeout = 300;
  const identityOptions = {
    id: 'stop',
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout,
    },
  };
  return notification.show(options).then(item => {
    t.is(notification.exists(identityOptions), true);

    return showItem(item).then(() => {
      item.timer.actions.stop();
      const remaining = notification.getRemaining(identityOptions);
      t.is(remaining === undefined, true);

      return new Promise(resolve => {
        setTimeout(() => {
          // should still exist
          t.is(notification.exists(identityOptions), true);
          resolve();
        }, timeout + 100);
      });
    });
  });
});
