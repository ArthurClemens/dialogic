import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { Dialogic } from "dialogic";
import { dialog, Dialog, notification, Notification, useDialogic } from "dialogic-react";
import { Content as DefaultContent } from "./default/Content";
import { Remaining } from "./Remaining";

import "./styles.css";

const getRandomId = () => Math.round(1000 * Math.random()).toString();

const showInitial = ({ isOnMount } : { isOnMount?: boolean } = {} ) => dialog.show(
  {
    title: getRandomId(),
    className: "xxx-content",
    dialogic: {
      component: DefaultContent,
      styles: {
        showStart: {
          opacity: isOnMount ? "1" : "0",
        },
        showEnd: {
          transitionDuration: isOnMount ? "0ms" : "500ms",
          opacity: "1"
        },
        hideEnd: {
          transitionDuration: "500ms",
          opacity: "0"
        }
      },
      className: "xxx",
      spawn: "initial",
    }
  }
);

const dialogOneProps: Dialogic.Options = {
  dialogic: {
    component: DefaultContent,
    className: "xxx",
  },
  className: "xxx-content",
  title: "Clock",
  id: getRandomId(),
};

const showNotification = () => {
  const title = "N " + getRandomId();
  return notification.show(
    {
      dialogic: {
        didShow: (item: Dialogic.Item) => console.log("didShow", item, title),
        didHide: (item: Dialogic.Item) => console.log("didHide", item, title),
        component: DefaultContent,
        className: "xxx-timings",
        spawn: "NO"
      },
      className: "xxx-timings-content",
      title,
    },
  ).then((item: Dialogic.Item) => console.log("notification shown", item, title))
};

type NotificationTestsProps = {
  // store: Dialogic.NamespaceStore;
}
const NotificationTests: FunctionComponent<NotificationTestsProps> = props => {
  const [] = useDialogic();

  return (
    <>
      <section className="section">
        <h2 className="title is-2">Notification</h2>
        <div>{`Notification count: ${notification.getCount({ spawn: "NO" })}`}</div>
        <div>{`Is shown: ${notification.exists({ spawn: "NO" })}`}</div>
        <div>{`Is paused: ${notification.isPaused({ spawn: "NO" })}`}</div>
        {notification.exists({ spawn: "NO" })
          ? <Remaining getRemaining={() => notification.getRemaining({ spawn: "NO" })} />
          : null
        }
      </section>
      <section className="section">
        <button
          className="button"
          onClick={showNotification}
        >
          Show notification
        </button>
        <button
          className="button"
          onClick={() => notification.pause({ spawn: "NO" })}
        >
          Pause
        </button>
        <button
          className="button"
          onClick={() => notification.resume({ spawn: "NO", minimumDuration: 2000 })}
        >
          Resume
        </button>
        <button
          className="button"
          onClick={() => notification.hide({ spawn: "NO" }).then((item: Dialogic.Item) => console.log("notification hidden from App", item))}
        >
          Hide
        </button>
      </section>
      <section className="section">
        <Notification spawn="NO" />
      </section>
    </>
  );
};

const App = () => {

  return (
    <div className="demo">

      {/* Dialog */}
      <section className="section">
        <h2 className="title is-2">Dialog</h2>
      </section>
      <section className="section">
        <button
          className="button"
          onClick={() => 
            dialog.show(
              {
                ...dialogOneProps,
                dialogic: {
                  ...dialogOneProps.dialogic,
                  id: dialogOneProps.id
                },
                title: dialogOneProps.title + ' ' + getRandomId(),
              }
            ) 
          }
        >
          Show dialog
        </button>
        <button
          className="button"
          onClick={() => 
            dialog.hide({ id: dialogOneProps.id })
          }
        >Hide</button>
      </section>
      <section className="section">
        <Dialog />
      </section>

      {/* Initially displayed */}
      <section className="section">
        <h2 className="title is-2">Initially displayed dialog</h2>
      </section>
      <section className="section">
        <button className="button" onClick={() => showInitial()}>
          Shown initially
        </button>
        <button className="button" onClick={() => dialog.hide({ spawn: "initial" })}>
          Hide
        </button>
      </section>
      <section className="section">
        <Dialog spawn="initial" onMount={() => showInitial({ isOnMount: true })} />
      </section>

      {/* Notification */}
      <NotificationTests />
    </div>

  );
};

const mountNode = document.querySelector("#root");
ReactDOM.render(<App />, mountNode);

// m("section", { className: "section"}, [
//   m("button",
//     {
//       className: "button",
//       onclick: () => {
//         const title = "N " + getRandomId();
//         return notification.show(
//           {
//             dialogic: {
//               didShow: (item: Dialogic.Item) => console.log("didShow", item, title),
//               didHide: (item: Dialogic.Item) => console.log("didHide", item, title),
//               component: DefaultContent,
//               className: "xxx-timings",
//               spawn: "NO"
//             },
//             className: "xxx-timings-content",
//             title,
//           },
//         ).then((item: Dialogic.Item) => console.log("notification shown", item, title))
//       } 
//     },
//     "Show notification"
//   ),
//   m("button",
//     {
//       className: "button",
//       onclick: () =>
//         notification.pause({ spawn: "NO" })
//     },
//     "Pause"
//   ),
//   m("button",
//     {
//       className: "button",
//       onclick: () =>
//         notification.resume({ spawn: "NO", minimumDuration: 2000 })
//     },
//     "Resume"
//   ),
//   m("button",
//     {
//       className: "button",
//       onclick: () =>
//         notification.hide({ spawn: "NO" }).then((item: Dialogic.Item) => console.log("notification hidden from App", item))
//     },
//     "Hide"
//   ),
// ]),
// m("section", { className: "section"}, [
//   m(Notification, { spawn: "NO" })
// ]),
