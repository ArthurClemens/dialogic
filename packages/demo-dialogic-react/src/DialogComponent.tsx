/**
 * This example uses Material IO
 */

import { dialog } from 'dialogic-react';
import React from 'react';

type DialogContentProps = {
  title: string;
  body: string;
  onAccept: () => void;
  onReject: () => void;
};

const DialogContent = (props: DialogContentProps) => (
  <div className="mdc-dialog__container">
    <div className="mdc-dialog__surface">
      <>
        <h2 className="h2 mdc-dialog__title">{props.title}</h2>
        <div className="mdc-dialog__content">{props.body}</div>
        <footer className="mdc-dialog__actions">
          <>
            <button
              type="button"
              className="mdc-button mdc-dialog__button"
              onClick={() => {
                dialog.hide();
                props.onReject();
              }}
            >
              <span className="mdc-button__label">Never mind</span>
            </button>
            <button
              type="button"
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
