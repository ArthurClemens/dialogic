/**
 * This example uses Material IO
 */

import React from 'react';
import { dialog } from 'dialogic-react';

type DialogContentProps = {
  title: string;
  body: string;
  onAccept: () => void;
  onReject: () => void;
};

export const DialogComponent = (props: DialogContentProps) => (
  <div
    className="mdc-dialog mdc-dialog--open"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="my-dialog-title"
    aria-describedby="my-dialog-content"
  >
    <DialogContent {...props} />
    <div className="mdc-dialog__scrim" /> {/* modal, onclick is not used */}
  </div>
);

const DialogContent = (props: DialogContentProps) => (
  <div className="mdc-dialog__container">
    <div className="mdc-dialog__surface">
      <>
        <h2 className="h2 mdc-dialog__title">{props.title}</h2>
        <div className="mdc-dialog__content">{props.body}</div>
        <footer className="mdc-dialog__actions">
          <>
            <button
              className="mdc-button mdc-dialog__button"
              onClick={() => {
                dialog.hide();
                props.onReject();
              }}
            >
              <span className="mdc-button__label">Never mind</span>
            </button>
            <button
              className="mdc-button mdc-dialog__button"
              onClick={() => {
                dialog.hide();
                props.onAccept();
              }}
            >
              <span className="mdc-button__label">Yes, retry</span>
            </button>
          </>
        </footer>
      </>
    </div>
  </div>
);
