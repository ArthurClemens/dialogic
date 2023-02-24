import { deepStrictEqual } from "assert";
import { dialog, notification, showItem } from "dialogic";

it("notification timeout: should hide after specified time", () => {
  notification.resetAll();
  const timeout = 300;
  const identityOptions = {
    id: "timeout",
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout,
    },
  };
  return notification.show(options).then((item) => {
    deepStrictEqual(notification.exists(identityOptions), true);

    return showItem(item).then(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            deepStrictEqual(notification.exists(identityOptions), false);
            resolve();
          }, timeout + 100);
        })
    );
  });
});

it("dialog timeout: should hide after specified time", () => {
  dialog.resetAll();
  const timeout = 300;
  const identityOptions = {
    id: "timeout",
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout,
    },
  };
  return dialog.show(options).then((item) => {
    deepStrictEqual(dialog.exists(identityOptions), true);

    return showItem(item).then(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            deepStrictEqual(dialog.exists(identityOptions), false);
            resolve();
          }, timeout + 100);
        })
    );
  });
});

it("pause and resume, with isPaused and minimumDuration", () => {
  notification.resetAll();
  const timeout = 300;
  const identityOptions = {
    id: "pause-resume",
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout,
    },
  };
  return notification.show(options).then((item) => {
    deepStrictEqual(notification.exists(identityOptions), true);

    return showItem(item).then(() => {
      let remaining1: number | undefined;

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          notification.pause(identityOptions);
          deepStrictEqual(notification.isPaused(identityOptions), true);

          remaining1 = notification.getRemaining(identityOptions);
          // t.log(`remaining1: ${remaining1}`);
          if (remaining1 !== undefined) {
            deepStrictEqual(remaining1 <= timeout, true);
            deepStrictEqual(remaining1 > 0, true);
          }
          notification.resume(identityOptions);
          deepStrictEqual(notification.isPaused(identityOptions), false);

          setTimeout(() => {
            notification.pause(identityOptions);
            const remaining2 = notification.getRemaining(identityOptions);
            // t.log(`remaining2: ${remaining2}`);
            if (remaining2 !== undefined) {
              deepStrictEqual(remaining2 <= timeout, true);
              deepStrictEqual(remaining2 > 0, true);
              if (remaining1 !== undefined) {
                deepStrictEqual(remaining2 < remaining1, true);
              }
            }

            notification.resume({
              ...identityOptions,
              minimumDuration: timeout,
            });
            notification.pause(identityOptions);
            const remaining3 = notification.getRemaining(identityOptions);
            // t.log(`remaining3: ${remaining3}`);
            if (remaining3 !== undefined) {
              deepStrictEqual(remaining3 <= timeout, true);
              deepStrictEqual(remaining3 > 0, true);
              if (remaining2 !== undefined) {
                deepStrictEqual(remaining3 > remaining2, true);
              }
            }

            notification.resume(identityOptions);
            deepStrictEqual(notification.isPaused(identityOptions), false);

            setTimeout(() => {
              const remaining4 = notification.getRemaining(identityOptions);
              // t.log(`remaining4: ${remaining4}`);
              deepStrictEqual(remaining4 === undefined, true);
              deepStrictEqual(notification.exists(identityOptions), false);

              resolve();
            }, timeout + 10);
          }, 50);
        }, 50);
      });
    });
  });
});

it("notification stop: should stop the timer", () => {
  notification.resetAll();
  const timeout = 300;
  const identityOptions = {
    id: "stop",
  };
  const options = {
    dialogic: {
      ...identityOptions,
      timeout,
    },
  };
  return notification.show(options).then((item) => {
    deepStrictEqual(notification.exists(identityOptions), true);

    return showItem(item).then(() => {
      item.timer?.actions.stop();
      const remaining = notification.getRemaining(identityOptions);
      deepStrictEqual(remaining === undefined, true);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // should still exist
          deepStrictEqual(notification.exists(identityOptions), true);
          resolve();
        }, timeout + 100);
      });
    });
  });
});
