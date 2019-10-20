import React from "react";
import ReactDOM from "react-dom";
import { Dialog, notification, Notification, useDialogicState } from "dialogic-react";
import { Remaining } from "./Remaining";
import { NotificationComponent } from "./NotificationComponent";

import "./styles.css";

const App = () => {
  useDialogicState();

  return (
    <>
      <div className="page">
        <main>
          <h1>Dialogic for React demo</h1>
          <div className="message">Add one or more notifications, then click on the Retry button in the message.</div>
          <div className="ui message">
            <button
              className="ui button primary"
              onClick={() => {
                notification.show({
                  dialogic: {
                    component: NotificationComponent,
                    className: "notification",
                  }
                })
              }}>
              Add notification
            </button>
            <button
              className="ui button"
              onClick={() => {
                notification.pause()
              }}>
              Pause
            </button>
            <button
              className="ui button"
              onClick={() => {
                notification.resume()
              }}>
              Resume
            </button>
            <button
              className="ui button"
              onClick={() => {
                notification.hideAll()
              }}>
              Hide all
            </button>
            <button
              className="ui button"
              onClick={() => {
                notification.resetAll()
              }}>
              Reset all
            </button>
          </div>
          <div className="ui message">
            <div className="ui label">
              Notifications
              <span className="detail">
                {notification.getCount()}
              </span>
            </div>
            <div className="ui label">
              Is paused
              <span className="detail">
                {notification.isPaused().toString()}
              </span>
            </div>
            <div className="ui label">
              Remaining
              <span className="detail">
                <Remaining getRemaining={notification.getRemaining} />
              </span>
            </div>
          </div>
        </main>
        <footer>
          Dialogic: manage dialogs and notifications. <a href='https://github.com/ArthurClemens/dialogic'>Main documentation on GitHub</a>
        </footer>
      </div>
      <Dialog />
      <Notification />
    </>
  );
};

const mountNode = document.querySelector("#root");
ReactDOM.render(<App />, mountNode);
