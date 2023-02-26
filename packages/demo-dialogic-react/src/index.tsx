import './styles.css';

import {
  Dialog,
  Notification,
  notification,
  useDialogicState,
} from 'dialogic-react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  NotificationComponent,
  TNotificationComponentProps,
} from './NotificationComponent';
import { RemainingLabel } from './RemainingLabel';

function App() {
  useDialogicState();

  return (
    <>
      <div className='page'>
        <main>
          <h1>Dialogic for React demo</h1>
          <div className='message'>
            Add one or more notifications, then click on the Show Options button
            in the message.
          </div>
          <div className='ui message'>
            <button
              type='button'
              className='ui button primary'
              onClick={() => {
                notification.show<TNotificationComponentProps>({
                  dialogic: {
                    component: NotificationComponent,
                    className: 'notification',
                    timeout: 4000,
                  },
                  roundToSeconds: true,
                });
              }}
            >
              Add notification
            </button>
            <button
              type='button'
              className='ui button'
              onClick={() => {
                notification.pause();
              }}
            >
              Pause
            </button>
            <button
              type='button'
              className='ui button'
              onClick={() => {
                notification.resume();
              }}
            >
              Resume
            </button>
            <button
              type='button'
              className='ui button'
              onClick={() => {
                notification.hideAll();
              }}
            >
              Hide all
            </button>
            <button
              type='button'
              className='ui button'
              onClick={() => {
                notification.resetAll();
              }}
            >
              Reset all
            </button>
          </div>
          <div className='ui message'>
            <div className='ui label'>
              Notifications
              <span className='detail'>{notification.getCount()}</span>
            </div>
            <div className='ui label'>
              Is paused
              <span className='detail'>
                {notification.isPaused().toString()}
              </span>
            </div>
            {notification.exists() && (
              <div className='ui label'>
                Remaining
                <span className='detail'>
                  <RemainingLabel />
                </span>
              </div>
            )}
          </div>
        </main>
        <footer>
          Dialogic: manage dialogs and notifications.{' '}
          <a href='https://github.com/ArthurClemens/dialogic'>
            Main documentation on GitHub
          </a>
        </footer>
      </div>
      <Dialog />
      <Notification />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // Can't use StrictMode here because in dev mode the dialog will receive an extra unmount, leading to a hidden dialog
  <App />,
);
